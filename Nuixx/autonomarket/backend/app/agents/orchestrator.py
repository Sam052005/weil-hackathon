from langgraph.graph import StateGraph, START, END
from app.agents.state import AgentState
from app.agents.discovery import discovery_node
from app.agents.negotiation import negotiation_node
from app.agents.routing import routing_node
from app.agents.recommendation import recommendation_node
from langgraph.checkpoint.memory import MemorySaver

def cerebrum_gate(state: AgentState) -> dict:
    return {"reasoning": ["Cerebrum gate processed. Waiting for human approval."]}

def auto_execute(state: AgentState) -> dict:
    return {"reasoning": ["Order auto-executed/settled (mock)."]}

def cancel_order(state: AgentState) -> dict:
    return {"reasoning": ["Order cancelled due to human rejection."]}

def route_after_routing(state: AgentState):
    if state.get("require_approval"):
        return "cerebrum_gate"
    return "auto_execute"

def route_after_gate(state: AgentState):
    # This will be replaced by actual Cerebrum Gateway logic in Phase 3.
    # We inspect the latest message for basic approval/rejection during graph resume.
    last_msg = state.get("messages", [])[-1] if state.get("messages") else None
    if last_msg and hasattr(last_msg, "content") and "reject" in last_msg.content.lower():
        return "cancel_order"
    return "auto_execute"

workflow = StateGraph(AgentState)

workflow.add_node("discovery", discovery_node)
workflow.add_node("negotiation", negotiation_node)
workflow.add_node("routing", routing_node)
workflow.add_node("recommendation", recommendation_node)
workflow.add_node("cerebrum_gate", cerebrum_gate)
workflow.add_node("auto_execute", auto_execute)
workflow.add_node("cancel_order", cancel_order)

workflow.add_edge(START, "discovery")
workflow.add_edge("discovery", "negotiation")
workflow.add_edge("negotiation", "routing")
workflow.add_edge("routing", "recommendation")

workflow.add_conditional_edges(
    "recommendation",
    route_after_routing,
    {"cerebrum_gate": "cerebrum_gate", "auto_execute": "auto_execute"}
)

workflow.add_conditional_edges(
    "cerebrum_gate",
    route_after_gate,
    {"auto_execute": "auto_execute", "cancel_order": "cancel_order"}
)

workflow.add_edge("auto_execute", END)
workflow.add_edge("cancel_order", END)

memory = MemorySaver()

agent_executor = workflow.compile(
    checkpointer=memory,
    interrupt_before=["cerebrum_gate"]
)
