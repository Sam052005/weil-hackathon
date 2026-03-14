"""Mock Cerebrum Gateway for demo."""
import logging

logger = logging.getLogger(__name__)

def evaluate_transaction(price: float, supplier_id: int) -> bool:
    """Returns True if human approval is needed."""
    return price >= 5000.0

def create_approval_request(order_data: dict) -> dict:
    """Mock an approval created event"""
    logger.info(f"Created approval request for order {order_data.get('id')}")
    return {
        "status": "pending",
        "order": order_data
    }
