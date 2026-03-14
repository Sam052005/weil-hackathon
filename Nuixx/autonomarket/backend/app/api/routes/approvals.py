from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.models.order import Order, OrderStatus, OrderItem

router = APIRouter()

class ApprovalAction(BaseModel):
    action: str  # "approve" or "reject"
    reason: str = ""

@router.get("/")
async def list_approvals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ApprovalRequest)
        .where(ApprovalRequest.status == ApprovalStatus.PENDING)
        .options(selectinload(ApprovalRequest.order).selectinload(Order.items).selectinload(OrderItem.product))
    )
    approvals = result.scalars().all()
    
    response = []
    for a in approvals:
        product_name = a.order.items[0].product.name if a.order.items and a.order.items[0].product else "Unknown Product"
        supplier_id = a.order.items[0].product.supplier_id if a.order.items and a.order.items[0].product else None
        
        response.append({
            "id": a.id,
            "order_id": a.order_id,
            "product_name": product_name,
            "supplier_id": supplier_id,
            "amount": a.order.total_amount,
            "status": a.status.value
        })
    return response

@router.post("/{approval_id}/action")
async def handle_action(approval_id: int, action: ApprovalAction, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ApprovalRequest).where(ApprovalRequest.id == approval_id))
    approval = result.scalars().first()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
        
    order_result = await db.execute(select(Order).where(Order.id == approval.order_id))
    order = order_result.scalars().first()
    
    if action.action == "approve":
        approval.status = ApprovalStatus.APPROVED
        if order:
            order.status = OrderStatus.COMPLETED
    else:
        approval.status = ApprovalStatus.REJECTED
        if order:
            order.status = OrderStatus.REJECTED
            
    approval.reason = action.reason
    await db.commit()
    
    return {"status": "success", "approval_id": approval.id}
