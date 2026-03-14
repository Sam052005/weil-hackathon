from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.audit import AuditLog

router = APIRouter()

@router.get("/")
async def list_audit_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()))
    logs = result.scalars().all()
    
    return [
        {
            "id": log.id,
            "thread_id": log.thread_id,
            "action": log.action,
            "details": log.details,
            "signature": log.signature,
            "created_at": log.created_at
        }
        for log in logs
    ]
