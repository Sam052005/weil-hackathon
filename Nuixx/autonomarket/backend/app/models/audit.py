from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.core.database import Base
from datetime import datetime, timezone

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(String, index=True, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    signature = Column(String, nullable=False) # HMAC-SHA256
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
