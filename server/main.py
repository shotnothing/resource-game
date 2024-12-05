from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import json
from typing import Dict, List
import sys
import os

# Add the parent directory of the current file to the Python path
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from core.game import Game

app = FastAPI()

games = { }

'''
Create a room:
    room_name: str
    username: str
    Does games[room_name] = Game().add_player(username)
    
Join a room:
    room_name: str
    username: str
    Does games[room_name] = games[room_name].add_player(username)
    
Begin a game:
    room_name: str
    Does games[room_name] = games[room_name].begin()

View a room:
    room_name: str
    Sends games[room_name].get_visible_state()
'''

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.websocket_to_room: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, room_name: str) -> None:
        '''
        Connect a websocket to a room.
        
        Args:
            websocket (WebSocket): The websocket to connect.
            room_name (str): The name of the room to connect to.
        '''
        # Disconnect from any previous room
        if websocket in self.websocket_to_room:
            old_room = self.websocket_to_room[websocket]
            self.active_connections[old_room].remove(websocket)
            
            # If the old room is empty, delete it
            if not self.active_connections[old_room]:
                del self.active_connections[old_room]
                
            # Delete the websocket to room mapping
            del self.websocket_to_room[websocket]
            
        # Now connect to new room
        if room_name not in self.active_connections:
            self.active_connections[room_name] = []
            
        # Add the websocket to the room
        self.active_connections[room_name].append(websocket)
        
        # Add the room to the websocket mapping
        self.websocket_to_room[websocket] = room_name

    def disconnect(self, websocket: WebSocket):
        '''
        Disconnect a websocket from a room.
        
        Args:
            websocket (WebSocket): The websocket to disconnect.
        '''
        room_name = self.websocket_to_room.get(websocket)
        
        # Remove the websocket from the room
        if room_name:
            self.active_connections[room_name].remove(websocket)
            
            # If the room is empty, delete it
            if not self.active_connections[room_name]:
                del self.active_connections[room_name]
            
            # Delete the websocket to room mapping
            del self.websocket_to_room[websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket) -> None:
        '''
        Send a personal message to a websocket.
        
        Args:
            message (str): The message to send.
            websocket (WebSocket): The websocket to send the message to.
        '''
        await websocket.send_text(message)

    async def broadcast(self, message: str, room_name: str) -> None:
        '''
        Broadcast a message to all websockets in a room.
        
        Args:
            message (str): The message to broadcast.
            room_name (str): The name of the room to broadcast the message to.
        '''
        if room_name in self.active_connections:
            for connection in self.active_connections[room_name]:
                await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    '''
    The main websocket endpoint for the server.
    
    Args:
        websocket (WebSocket): The websocket to handle.
    '''
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            command = message.get('command')
            room_name = message.get('room_name')
            username = message.get('username')
            
            action = message.get('action', None)
            action_args = message.get('action_args', {})
            
            if command == 'create_room':
                if room_name in games:
                    await manager.send_personal_message(f"Room {room_name} already exists", websocket)
                else:
                    try:
                        games[room_name] = Game().add_player(username)
                    except Exception as e:
                        await manager.send_personal_message(f"Error: {e}", websocket)
                        continue
                    
                    await manager.connect(websocket, room_name)
                    await manager.broadcast(f"{username} created and joined the room {room_name}", room_name)

            elif command == 'join_room':
                if room_name in games:
                    try:
                        games[room_name] = games[room_name].add_player(username)
                    except Exception as e:
                        await manager.send_personal_message(f"Error: {e}", websocket)
                        continue
                    
                    await manager.connect(websocket, room_name)
                    await manager.broadcast(f"{username} joined the room {room_name}", room_name)
                else:
                    await manager.send_personal_message(f"Room {room_name} does not exist", websocket)

            elif command == 'begin_game':
                if room_name in games:
                    try:
                        games[room_name] = games[room_name].begin('./core/cards.json', './core/collections.json')
                    except Exception as e:
                        await manager.send_personal_message(f"Error: {e}", websocket)
                        continue
                    
                    await manager.broadcast(f"Game in room {room_name} has begun", room_name)
                else:
                    await manager.send_personal_message(f"Room {room_name} does not exist", websocket)
                    
            elif command == 'get_cards_and_collections':
                if room_name in games:
                    try:
                        cards = games[room_name].get_cards()
                        collections = games[room_name].get_collections()
                    except Exception as e:
                        await manager.send_personal_message(f"Error: {e}", websocket)
                        continue
                    
                    await manager.send_personal_message(json.dumps({
                        "cards": cards,
                        "collections": collections
                    }), websocket)
                else:
                    await manager.send_personal_message(f"Room {room_name} does not exist", websocket)

            elif command == 'view_room':
                if room_name in games:
                    try:
                        state = games[room_name].get_visible_state()
                    except Exception as e:
                        await manager.send_personal_message(f"Error: {e}", websocket)
                        continue
                    
                    await manager.send_personal_message(json.dumps(state), websocket)
                else:
                    await manager.send_personal_message(f"Room {room_name} does not exist", websocket)

            elif command == 'action':
                if room_name in games:
                    try:
                        games[room_name] = games[room_name].do_action(action, username, **action_args)
                    except Exception as e:
                        await manager.send_personal_message(f"Error: {e}", websocket)
                        continue
                    
                    await manager.broadcast(f"{username} took action {action}", room_name)

            else:
                await manager.send_personal_message("Unknown command", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)