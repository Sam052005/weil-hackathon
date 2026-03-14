from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import auth, products, orders, agent, approvals, websocket

from app.models import user, product, order, approval, audit
import logging

logger = logging.getLogger(__name__)

from app.core.database import AsyncSessionLocal
from sqlalchemy import select

async def seed_data():
    async with AsyncSessionLocal() as session:
        # Seed demo user
        result_user = await session.execute(select(user.User).where(user.User.email == "demo@autonomarket.com"))
        if not result_user.scalars().first():
            from app.core.security import get_password_hash
            demo_user = user.User(email="demo@autonomarket.com", full_name="Demo User", hashed_password=get_password_hash("password"), wallet_address="0xMockWalletAddressForDemo")
            session.add(demo_user)
            await session.commit()
            logger.info("Database seeded with demo user.")

        result = await session.execute(select(product.Product))
        if not result.scalars().first():
            tech_haven = product.Supplier(name="Tech Haven", wallet_address="0x111", is_trusted=True)
            elec_hub = product.Supplier(name="Electronics Hub", wallet_address="0x222", is_trusted=True)
            keeb_wh = product.Supplier(name="Keeb Warehouse", wallet_address="0x333", is_trusted=True)
            session.add_all([tech_haven, elec_hub, keeb_wh])
            await session.commit()
            
            p1 = product.Product(name="Sony WH-1000XM5 Wireless Headphones", description="Industry leading noise canceling headphones.", price=29999.0, stock=42, supplier_id=elec_hub.id)
            p2 = product.Product(name="Apple MacBook Air M3", description="Supercharged by M3, the MacBook Air is light and powerful.", price=114900.0, stock=15, supplier_id=tech_haven.id)
            p3 = product.Product(name="Keychron Q1 Pro Mechanical Keyboard", description="A fully customizable 75% layout custom mechanical keyboard.", price=16500.0, stock=8, supplier_id=keeb_wh.id)
            session.add_all([p1, p2, p3])
            await session.commit()
            logger.info("Database seeded with initial products.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables verified.")
    await seed_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(products.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(orders.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(agent.router, prefix=f"{settings.API_V1_STR}/agent", tags=["agent"])
app.include_router(approvals.router, prefix=f"{settings.API_V1_STR}/approvals", tags=["approvals"])
from app.api.routes import audit
app.include_router(audit.router, prefix=f"{settings.API_V1_STR}/audit", tags=["audit"])
app.include_router(websocket.router, tags=["websocket"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
