import logging
import hashlib
import hmac
import json
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models.audit import AuditLog

logger = logging.getLogger(__name__)

async def log_action(db: AsyncSession, thread_id: str, action: str, details: str):
    secret_key = settings.SECRET_KEY.encode('utf-8')
    payload = f"{thread_id}:{action}:{details}".encode('utf-8')
    signature = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
    
    audit_entry = AuditLog(
        thread_id=thread_id,
        action=action,
        details=details,
        signature=signature
    )
    db.add(audit_entry)
    await db.commit()
    await db.refresh(audit_entry)
    
    logger.info(f"AUDIT LOG saved for thread {thread_id} - action '{action}' - signature {signature}")
    return audit_entry
