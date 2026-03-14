"""
Core API tests — health check and basic endpoint behaviour.

DB setup, seeding and get_db override are handled by conftest.py.
"""

import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """GET /health must return 200 with {status: ok}."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_list_products_not_empty():
    """GET /api/v1/products/ returns a list (seeded in conftest)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/products/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    product = data[0]
    assert "id" in product
    assert "name" in product
    assert "price" in product


@pytest.mark.asyncio
async def test_login_invalid_credentials():
    """POST /api/v1/auth/login with bad credentials returns 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": "nobody@example.com", "password": "wrong"},
        )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_valid_credentials():
    """POST /api/v1/auth/login with demo credentials returns a token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": "demo@autonomarket.com", "password": "password"},
        )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
