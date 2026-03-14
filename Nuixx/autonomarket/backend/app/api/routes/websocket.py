from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.cerebrum.notifications import manager
import asyncio
import json

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keep connection alive and wait for external broadcasts
            data = await websocket.receive_text()
            # Echo back for debug
            # await manager.broadcast(f"Received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
