from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    wallet_address = Column(String, unique=True)
    reputation_score = Column(Float, default=5.0)
    is_trusted = Column(Boolean, default=False)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    stock = Column(Integer, default=0)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))

    category = relationship("Category")
    supplier = relationship("Supplier")
