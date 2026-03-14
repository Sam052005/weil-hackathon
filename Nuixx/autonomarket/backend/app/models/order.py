import enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    AWAITING_APPROVAL = "AWAITING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float, default=0.0)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    
    items = relationship("OrderItem", back_populates="order")
    user = relationship("User")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    price_at_purchase = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
