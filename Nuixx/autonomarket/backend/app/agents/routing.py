from app.agents.state import AgentState

async def routing_node(state: AgentState) -> dict:
    final_price = state.get("final_price", 0)
    
    # 5000 INR threshold for human approval
    require_approval = False
    
    if final_price >= 5000.0:
        require_approval = True
        reason = f"Routing decided approval requirement: True (Price {final_price} >= 5000)"
    else:
        reason = f"Routing decided approval requirement: False (Price {final_price} < 5000)"
        
    return {
        "require_approval": require_approval,
        "payment_method": "WUSD",
        "shipping_option": "Standard",
        "reasoning": [reason]
    }
