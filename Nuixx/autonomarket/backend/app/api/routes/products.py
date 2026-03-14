from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.product import Product

router = APIRouter()

@router.get("/")
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).options(selectinload(Product.supplier)))
    products = result.scalars().all()
    # Serialize to dict to match previous response structure for frontend
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "stock_quantity": p.stock,
            "supplier": p.supplier.name if p.supplier else "Unknown"
        }
        for p in products
    ]
