import json
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from app.agents.state import AgentState
from app.core.config import settings

logger = logging.getLogger(__name__)

from app.core.database import AsyncSessionLocal
from sqlalchemy.future import select
from app.models.product import Product

async def get_db_products():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Product))
        return [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "price": p.price,
                "stock_quantity": p.stock
            }
            for p in result.scalars().all()
        ]

# Initialize Gemini Flash
llm = None
if settings.GOOGLE_API_KEY:
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite", google_api_key=settings.GOOGLE_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Gemini: {e}")

def _simulated_discovery(query: str, db_products: list) -> dict:
    """Keyword-based fallback when LLM is unavailable."""
    selected = db_products[0] if db_products else None
    if not selected:
        return {"reasoning": ["No products in database"]}
    q = query.lower()
    for p in db_products:
        if any(word in p["name"].lower() for word in q.split()):
            selected = p
            break
    return {
        "selected_product_id": selected["id"],
        "selected_product_name": selected["name"],
        "original_price": selected["price"],
        "supplier_id": 1,
        "confidence": 0.85,
        "reasoning": [f"[Discovery] (Simulated) Matched '{selected['name']}' based on query keywords."]
    }

async def discovery_node(state: AgentState) -> dict:
    query = state["query"]
    db_products = await get_db_products()

    if not llm:
        return _simulated_discovery(query, db_products)

    catalog_context = json.dumps(db_products, indent=2)
    system_prompt = f"""
    You are the Discovery Agent for AutonoMarket.
    Your task: Match the user's query to the most relevant product in our catalog.
    
    Catalog:
    {catalog_context}
    
    Instructions:
    1. Analyze the user intent.
    2. Select the best match ID.
    3. Return ONLY a JSON object: {{"product_id": int, "reasoning": "brief explanation"}}
    """

    try:
        resp = await llm.ainvoke([SystemMessage(content=system_prompt), HumanMessage(content=query)])
        data = json.loads(resp.content.replace("```json", "").replace("```", "").strip())

        product_id = data.get("product_id")
        selected = next((p for p in db_products if p["id"] == product_id), db_products[0] if db_products else None)
        if not selected:
            return {"reasoning": ["No products in database"]}

        return {
            "selected_product_id": selected["id"],
            "selected_product_name": selected["name"],
            "original_price": selected["price"],
            "supplier_id": 1,
            "confidence": 0.98,
            "reasoning": [f"[Discovery] {data.get('reasoning', 'Found matching product.')}"]
        }
    except Exception as e:
        logger.warning(f"Discovery LLM Error (falling back to simulation): {e}")
        return _simulated_discovery(query, db_products)
