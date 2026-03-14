from typing import TypedDict, Annotated, Optional, Any
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    query: str
    plan: list[str]
    
    # Discovery output
    selected_product_id: Optional[int]
    selected_product_name: Optional[str]
    original_price: Optional[float]
    supplier_id: Optional[int]
    confidence: float
    
    # Negotiation output
    final_price: Optional[float]
    
    # Routing output
    require_approval: bool
    payment_method: Optional[str]
    shipping_option: Optional[str]
    
    # Generic state accumulation
    reasoning: Annotated[list[str], operator.add]
