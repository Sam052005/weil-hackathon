import enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime, timezone

class ApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ESCALATED = "ESCALATED"

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    reason = Column(String)
    risk_score = Column(Float)
    timeout_at = Column(DateTime)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    order = relationship("Order")
    approver = relationship("User")
