import json
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from app.agents.state import AgentState
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Gemini Flash Lite
llm = None
if settings.GOOGLE_API_KEY:
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite", google_api_key=settings.GOOGLE_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Gemini: {e}")

def _simulated_negotiation(product_name: str, original_price: float) -> dict:
    """Fallback simulation when LLM is unavailable or quota exceeded."""
    final_price = round(original_price * 0.92, 2)
    return {
        "final_price": final_price,
        "reasoning": [f"[Negotiation] (Simulated) Secured an 8% volume discount on '{product_name}'. Final: ₹{final_price:,.2f}"]
    }

async def negotiation_node(state: AgentState) -> dict:
    product_name = state.get("selected_product_name")
    original_price = state.get("original_price", 0)

    if not llm:
        return _simulated_negotiation(product_name, original_price)

    system_prompt = f"""
    You are the Negotiation Agent for AutonoMarket.
    You are bargaining with a supplier for '{product_name}' (Original Price: ₹{original_price}).
    
    Goal: Secure a realistic discount (2% to 12%) based on volume or market trends.
    
    Return ONLY a JSON object: {{"final_price": float, "bargaining_log": "short summary of the verbal battle"}}
    """

    try:
        resp = await llm.ainvoke([SystemMessage(content=system_prompt), HumanMessage(content="Start negotiation.")])
        data = json.loads(resp.content.replace("```json", "").replace("```", "").strip())

        final_price = data.get("final_price", original_price)

        return {
            "final_price": final_price,
            "reasoning": [f"[Negotiation] {data.get('bargaining_log', 'Successfully negotiated a better deal.')}"]
        }
    except Exception as e:
        logger.warning(f"Negotiation LLM Error (falling back to simulation): {e}")
        return _simulated_negotiation(product_name, original_price)

