from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
from typing import Dict, List
import sys
import os

# Add the parent directory of the current file to the Python path
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from core.game import Game

app = FastAPI()

games: Dict[str, Game] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.websocket_to_room: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, room_name: str) -> None:
        # Disconnect from any previous room
        if websocket in self.websocket_to_room:
            old_room = self.websocket_to_room[websocket]
            self.active_connections[old_room].remove(websocket)
            
            if not self.active_connections[old_room]:
                del self.active_connections[old_room]
            del self.websocket_to_room[websocket]
        
        # Connect to the new room
        if room_name not in self.active_connections:
            self.active_connections[room_name] = []
            
        self.active_connections[room_name].append(websocket)
        self.websocket_to_room[websocket] = room_name

    def disconnect(self, websocket: WebSocket):
        room_name = self.websocket_to_room.get(websocket)
        if room_name and room_name in self.active_connections:
            self.active_connections[room_name].remove(websocket)
            if not self.active_connections[room_name]:
                del self.active_connections[room_name]
            del self.websocket_to_room[websocket]

    async def send_json(self, websocket: WebSocket, data: dict):
        """Send a JSON message to a single websocket."""
        await websocket.send_text(json.dumps(data))

    async def send_error(self, websocket: WebSocket, message: str):
        """Send an error message to a single websocket."""
        await self.send_json(websocket, {"type": "error", "message": message})

    async def send_success(self, websocket: WebSocket, message: str):
        """Send a success or informational message to a single websocket."""
        await self.send_json(websocket, {"type": "info", "message": message})

    async def broadcast_json(self, room_name: str, data: dict):
        """Broadcast a JSON message to all websockets in a room."""
        if room_name in self.active_connections:
            msg = json.dumps(data)
            for connection in self.active_connections[room_name]:
                await connection.send_text(msg)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            data = await websocket.receive_text()
        except WebSocketDisconnect:
            manager.disconnect(websocket)
            break

        # Parse the incoming message
        try:
            message = json.loads(data)
        except json.JSONDecodeError:
            await manager.send_error(websocket, "Invalid JSON format.")
            continue

        # Extract common parameters
        command = message.get('command')
        room_name = message.get('room_name')
        username = message.get('username')
        action = message.get('action', None)
        action_args = message.get('action_args', {})

        if command == 'create_room':
            if not room_name or not username:
                await manager.send_error(websocket, "Missing 'room_name' or 'username'.")
                continue

            if room_name in games:
                await manager.send_error(websocket, f"Room {room_name} already exists.")
                continue

            try:
                games[room_name] = Game().add_player(username)
            except Exception as e:
                await manager.send_error(websocket, f"Error creating room: {e}")
                continue

            await manager.connect(websocket, room_name)
            await manager.broadcast_json(room_name, {
                "type": "notification",
                "message": f"{username} created and joined the room {room_name}"
            })

        elif command == 'join_room':
            if not room_name or not username:
                await manager.send_error(websocket, "Missing 'room_name' or 'username'.")
                continue

            if room_name not in games:
                await manager.send_error(websocket, f"Room {room_name} does not exist.")
                continue

            try:
                games[room_name] = games[room_name].add_player(username)
            except Exception as e:
                await manager.send_error(websocket, f"Error joining room: {e}")
                continue

            await manager.connect(websocket, room_name)
            await manager.broadcast_json(room_name, {
                "type": "notification",
                "message": f"{username} joined the room {room_name}"
            })

        elif command == 'begin_game':
            if not room_name:
                await manager.send_error(websocket, "Missing 'room_name'.")
                continue

            if room_name not in games:
                await manager.send_error(websocket, f"Room {room_name} does not exist.")
                continue

            try:
                games[room_name] = games[room_name].begin('./core/cards.json', './core/collections.json')
            except Exception as e:
                await manager.send_error(websocket, f"Error beginning game: {e}")
                continue

            await manager.broadcast_json(room_name, {
                "type": "notification",
                "message": f"Game in room {room_name} has begun."
            })

        elif command == 'get_cards_and_collections':
            if not room_name:
                await manager.send_error(websocket, "Missing 'room_name'.")
                continue

            if room_name not in games:
                await manager.send_error(websocket, f"Room {room_name} does not exist.")
                continue

            try:
                cards = games[room_name].get_cards()
                collections = games[room_name].get_collections()
            except Exception as e:
                await manager.send_error(websocket, f"Error fetching data: {e}")
                continue

            await manager.send_json(websocket, {
                "type": "game_state_update",
                "gameStateDelta": {
                    "cards": cards,
                    "collections": collections
                }
            })

        elif command == 'view_room':
            if not room_name:
                await manager.send_error(websocket, "Missing 'room_name'.")
                continue

            if room_name not in games:
                await manager.send_error(websocket, f"Room {room_name} does not exist.")
                continue

            await manager.connect(websocket, room_name)

            try:
                state = games[room_name].get_visible_state()
            except Exception as e:
                await manager.send_error(websocket, f"Error viewing room: {e}")
                continue

            await manager.send_json(websocket, {
                "type": "game_state_update",
                "gameStateDelta": {
                    "game": state
                }
            })

        elif command == 'action':
            if not all([room_name, username, action]):
                await manager.send_error(websocket, "Missing 'room_name', 'username', or 'action'.")
                continue

            if room_name not in games:
                await manager.send_error(websocket, f"Room {room_name} does not exist.")
                continue

            try:
                games[room_name] = games[room_name].do_action(action, username, **action_args)
            except Exception as e:
                await manager.send_error(websocket, f"Error performing action: {e}")
                continue

            await manager.broadcast_json(room_name, {
                "type": "notification",
                "message": f"{username} took action {action}"
            })
            
            await manager.broadcast_json(room_name, {
                "type": "game_state_update",
                "gameStateDelta": {
                    "game": games[room_name].get_visible_state()
                }
            })
            
        else:
            # Unknown command
            await manager.send_error(websocket, "Unknown command.")
