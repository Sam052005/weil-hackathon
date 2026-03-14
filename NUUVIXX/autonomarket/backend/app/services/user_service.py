# user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.security import get_password_hash

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, email: str, password: str, wallet_address: str = None) -> User:
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        wallet_address=wallet_address
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
