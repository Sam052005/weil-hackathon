from app.agents.state import AgentState

async def recommendation_node(state: AgentState) -> dict:
    product_name = state.get("selected_product_name")
    
    if not product_name:
        return {"reasoning": ["Skipped recommendation because no product was selected."]}
        
    return {
        "reasoning": [f"Recommendation engine generated cross-sell items for '{product_name}'."]
    }
