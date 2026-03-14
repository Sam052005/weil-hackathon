import uuid
import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.agents.orchestrator import agent_executor
from app.core.database import get_db
from app.models.user import User
from app.models.order import Order, OrderStatus, OrderItem
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.cerebrum.notifications import manager

router = APIRouter()

class AgentQueryRequest(BaseModel):
    query: str
    thread_id: Optional[str] = None

@router.post("/query")
async def agent_query(request: AgentQueryRequest, db: AsyncSession = Depends(get_db)):
    # Fallback user since frontend doesn't send auth header for this demo route yet
    result = await db.execute(select(User).where(User.email == "demo@autonomarket.com"))
    current_user = result.scalars().first()

    thread_id = request.thread_id or str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    initial_state = {
        "query": request.query,
        "reasoning": [],
        "plan": ["Discovery", "Negotiation", "Routing", "Recommendation"]
    }
    
    async for event in agent_executor.astream(initial_state, config=config):
        pass 
        
    state_data = agent_executor.get_state(config)
    state = state_data.values
    is_interrupted = len(state_data.next) > 0
    is_waiting_for_approval = is_interrupted and "cerebrum_gate" in state_data.next
    
    selected_id = state.get("selected_product_id")
    if selected_id and current_user:
        new_order = Order(
            user_id=current_user.id,
            total_amount=state.get("final_price", 0),
            status=OrderStatus.AWAITING_APPROVAL if is_waiting_for_approval else OrderStatus.COMPLETED
        )
        db.add(new_order)
        await db.commit()
        await db.refresh(new_order)
        
        new_item = OrderItem(
            order_id=new_order.id, 
            product_id=selected_id, 
            quantity=1, 
            price_at_purchase=state.get("final_price", 0)
        )
        db.add(new_item)
        
        if is_waiting_for_approval:
            new_approval = ApprovalRequest(
                order_id=new_order.id,
                status=ApprovalStatus.PENDING,
                reason="Value threshold exceeded in LangGraph routing.",
                risk_score=0.85
            )
            db.add(new_approval)
            await db.commit()
            await db.refresh(new_approval)
            
            await manager.broadcast(json.dumps({
                "type": "NEW_APPROVAL",
                "approval_id": new_approval.id,
                "product_name": state.get("selected_product_name"),
                "amount": new_order.total_amount
            }))
        else:
            await db.commit()
            
    # Persist the reasoning trace to the Audit DB with HMAC signature
    reasoning_list = state.get("reasoning", [])
    if reasoning_list:
        from app.audit.logger import log_action
        details = json.dumps({"plan": state.get("plan", []), "trace": reasoning_list})
        await log_action(db, thread_id, "agent_trace", details)

    return {
        "thread_id": thread_id,
        "plan": state.get("plan", []),
        "selected_product": {
            "id": state.get("selected_product_id"),
            "name": state.get("selected_product_name")
        } if state.get("selected_product_id") else None,
        "final_price": state.get("final_price"),
        "confidence": state.get("confidence"),
        "require_approval": state.get("require_approval"),
        "is_waiting_for_approval": is_waiting_for_approval,
        "reasoning": state.get("reasoning", [])
    }
