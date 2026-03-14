from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.order import Order
from app.models.user import User

router = APIRouter()

@router.get("/")
async def list_orders(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order).where(Order.user_id == current_user.id).options(selectinload(Order.items))
    )
    orders = result.scalars().all()
    
    return [
        {
            "id": o.id,
            "user_id": o.user_id,
            "total_amount": o.total_amount,
            "status": o.status.value if o.status else "PENDING",
            "items_count": len(o.items)
        }
        for o in orders
    ]
