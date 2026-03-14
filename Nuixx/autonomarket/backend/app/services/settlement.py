import logging

logger = logging.getLogger(__name__)

async def deposit_to_escrow(order_id: int, amount: float):
    # Mock escrow deposit
    logger.info(f"ESCROW: Deposited {amount} WUSD for Order #{order_id} to mock Smart Contract.")
    return "0xMockTxHashDeposit"

async def release_from_escrow(order_id: int):
    # Mock escrow release
    logger.info(f"ESCROW: Released funds for Order #{order_id} from mock Smart Contract.")
    return "0xMockTxHashRelease"
