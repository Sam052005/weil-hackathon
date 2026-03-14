# product_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.product import Product

async def get_products(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Product).offset(skip).limit(limit))
    return result.scalars().all()

async def get_product_by_id(db: AsyncSession, product_id: int) -> Product | None:
    result = await db.execute(select(Product).where(Product.id == product_id))
    return result.scalars().first()

async def create_product(db: AsyncSession, name: str, description: str, price: float, stock_quantity: int) -> Product:
    product = Product(
        name=name,
        description=description,
        price=price,
        stock_quantity=stock_quantity
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product
