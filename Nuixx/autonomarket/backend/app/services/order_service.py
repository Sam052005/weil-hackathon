# order_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.order import Order

async def get_orders_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(Order).where(Order.user_id == user_id))
    return result.scalars().all()

async def get_order_by_id(db: AsyncSession, order_id: int) -> Order | None:
    result = await db.execute(select(Order).where(Order.id == order_id))
    return result.scalars().first()

async def create_order(db: AsyncSession, user_id: int, total_amount: float) -> Order:
    order = Order(
        user_id=user_id,
        total_amount=total_amount,
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order
