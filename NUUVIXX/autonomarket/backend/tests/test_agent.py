"""
Agent pipeline tests.

DB setup, seeding and get_db override are handled by conftest.py.
The LLM (Gemini) is mocked so tests are deterministic and offline-safe.
"""

import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.agents.state import AgentState


# ---------------------------------------------------------------------------
# Unit Tests — individual agent nodes
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_discovery_node_simulated():
    """discovery_node returns a valid dict even without an LLM (simulation path)."""
    from app.agents import discovery

    with patch.object(discovery, "llm", None):
        with patch(
            "app.agents.discovery.get_db_products",
            new=AsyncMock(
                return_value=[
                    {
                        "id": 1,
                        "name": "Test Wireless Headphones",
                        "description": "Great.",
                        "price": 2999.0,
                        "stock_quantity": 10,
                    }
                ]
            ),
        ):
            state = AgentState(
                messages=[],
                query="headphones",
                plan=["Discovery"],
                selected_product_id=None,
                selected_product_name=None,
                original_price=None,
                supplier_id=None,
                confidence=0.0,
                final_price=None,
                require_approval=False,
                payment_method=None,
                shipping_option=None,
                reasoning=[],
            )
            result = await discovery.discovery_node(state)

    assert "selected_product_id" in result
    assert result["selected_product_id"] == 1
    assert result["confidence"] == 0.85
    assert len(result["reasoning"]) > 0


@pytest.mark.asyncio
async def test_negotiation_node_simulated():
    """negotiation_node applies an 8% discount via simulation when LLM is absent."""
    from app.agents import negotiation

    with patch.object(negotiation, "llm", None):
        state = AgentState(
            messages=[],
            query="headphones",
            plan=["Negotiation"],
            selected_product_id=1,
            selected_product_name="Test Wireless Headphones",
            original_price=2999.0,
            supplier_id=1,
            confidence=0.85,
            final_price=None,
            require_approval=False,
            payment_method=None,
            shipping_option=None,
            reasoning=[],
        )
        result = await negotiation.negotiation_node(state)

    assert "final_price" in result
    assert result["final_price"] == round(2999.0 * 0.92, 2)
    assert len(result["reasoning"]) > 0


@pytest.mark.asyncio
async def test_routing_node_requires_approval_above_threshold():
    """routing_node sets require_approval=True when final_price >= 5000."""
    from app.agents.routing import routing_node

    state = AgentState(
        messages=[],
        query="macbook",
        plan=["Routing"],
        selected_product_id=2,
        selected_product_name="Apple MacBook Air M3",
        original_price=114900.0,
        supplier_id=1,
        confidence=0.98,
        final_price=105708.0,
        require_approval=False,
        payment_method=None,
        shipping_option=None,
        reasoning=[],
    )
    result = await routing_node(state)
    assert result["require_approval"] is True


@pytest.mark.asyncio
async def test_routing_node_no_approval_below_threshold():
    """routing_node sets require_approval=False when final_price < 5000."""
    from app.agents.routing import routing_node

    state = AgentState(
        messages=[],
        query="cheap item",
        plan=["Routing"],
        selected_product_id=1,
        selected_product_name="Budget Item",
        original_price=1000.0,
        supplier_id=1,
        confidence=0.8,
        final_price=920.0,
        require_approval=False,
        payment_method=None,
        shipping_option=None,
        reasoning=[],
    )
    result = await routing_node(state)
    assert result["require_approval"] is False


# ---------------------------------------------------------------------------
# Integration Test — full agent query via REST endpoint
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_agent_query_endpoint():
    """
    POST /api/v1/agent/query returns 200 with expected response keys.
    The LLM is mocked so no API key is required.
    """
    from app.agents import discovery, negotiation

    with patch.object(discovery, "llm", None), patch.object(negotiation, "llm", None):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post(
                "/api/v1/agent/query",
                json={"query": "headphones"},
            )

    assert response.status_code == 200
    data = response.json()
    assert "thread_id" in data
    assert "plan" in data
    assert "reasoning" in data
    assert isinstance(data["reasoning"], list)
    assert len(data["reasoning"]) > 0
