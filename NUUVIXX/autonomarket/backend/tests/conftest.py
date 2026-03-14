"""
Shared pytest fixtures for the AutonoMarket backend test suite.

All tests share a single in-memory SQLite database so that:
  - Tables are only created once per session.
  - The FastAPI `get_db` dependency override is set exactly once.
  - Test isolation is achieved by test ordering, not separate engines.
"""

import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.core.database import Base, get_db
from app.core.security import get_password_hash
from app.models.product import Product, Supplier
from app.models.user import User

# ---------------------------------------------------------------------------
# Shared in-memory test engine
# ---------------------------------------------------------------------------

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

shared_test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
SharedTestSession = async_sessionmaker(
    shared_test_engine, class_=AsyncSession, expire_on_commit=False
)


async def override_get_db():
    """Single get_db override used by all tests."""
    async with SharedTestSession() as session:
        yield session


# Set the override once at import time so all test modules use it.
app.dependency_overrides[get_db] = override_get_db


# ---------------------------------------------------------------------------
# Session-scoped DB setup: create tables + seed minimal data
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    """
    Create all tables and seed the shared test database.
    Runs once per pytest session before any test.
    """
    async with shared_test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SharedTestSession() as session:
        # Seed the demo user expected by the agent route
        demo_user = User(
            email="demo@autonomarket.com",
            full_name="Demo User",
            hashed_password=get_password_hash("password"),
            wallet_address="0xTestWallet",
        )
        session.add(demo_user)
        await session.flush()

        # Seed a supplier and product for agent tests
        supplier = Supplier(
            name="Test Supplier",
            wallet_address="0xSupplier1",
            is_trusted=True,
        )
        session.add(supplier)
        await session.flush()

        product = Product(
            name="Test Wireless Headphones",
            description="Great audio quality.",
            price=2999.0,
            stock=10,
            supplier_id=supplier.id,
        )
        session.add(product)
        await session.commit()

    yield

    async with shared_test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await shared_test_engine.dispose()
