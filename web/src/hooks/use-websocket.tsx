// use-websocket.tsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '@/game/Store/game-store';
import { GameState } from '@/game/types';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Art from '@/resources/art.json';

type ServerMessage = {
  type: string;
  message?: string;
  gameState?: Partial<GameState>;
  cards?: Record<number, any>;
  collections?: Record<number, any>;
  error?: string;
  [key: string]: any;
};

export type DoActionType = (
  action: string,
  action_args: Record<string, any>
) => void

export function useWebSocket(url: string = 'wss://game-server.jwen.cc/ws') {
  const socketRef = useRef<WebSocket | null>(null);
  const [hasConnected, setHasConnected] = useState(false);
  const { roomName, yourName } = useParams();
  const { gameState, setGameState, setRoomName, setYourName } = useGameStore();
  const { toast } = useToast();

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      setHasConnected(true);

      viewRoom()
      setRoomName(roomName || '')
      setYourName(yourName || '')
    };

    socket.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);

        console.log("Received message", data);

        switch (data.type) {
          case 'game_state_update':
            setGameState({
              ...gameState,
              game: data.gameStateDelta?.game || gameState.game,
              cards: data.cards || gameState.cards,
              collections: data.collections || gameState.collections,
            });
            console.log("Setting game state", gameState);
            break;

          case 'notification':
            console.log('Notification:', data.message);

            switch (data.action) {
              case 'take_same':
                toast({
                  title: `${data.username} took 2 ${data.action_args.color} tokens`,
                  variant: "default",
                });
                break;
              case 'take_different':
                toast({
                  title: `${data.username} took ${data.action_args.colors.join(', ')} tokens`,
                  variant: "default",
                });
                break;
              case 'reserve':
                toast({
                  title: `${data.username} reserved ${Art[gameState.cards[data.action_args.card_id].art as keyof typeof Art].icon
                    }${Art[gameState.cards[data.action_args.card_id].art as keyof typeof Art].name
                    } (${gameState.cards[data.action_args.card_id].score})`,
                  variant: "default",
                });
                break;
              case 'purchase':
                toast({
                  title: `${data.username} purchased ${Art[gameState.cards[data.action_args.card_id].art as keyof typeof Art].icon
                    }${Art[gameState.cards[data.action_args.card_id].art as keyof typeof Art].name
                    } (${gameState.cards[data.action_args.card_id].score})`,
                  variant: "default",
                });
                break;
            }
            break;

          case 'error':
            console.error('Error:', data.message || data.error);
            toast({
              title: data.message || data.error,
              variant: "destructive",
            });
            break;

          case 'info':
            console.log('Info:', data.message);
            toast({
              title: data.message,
              variant: "default",
            });
            break;

          default:
            console.log('Unknown message type:', data);
            break;
        }
      } catch (err) {
        console.warn('Failed to parse server message:', event.data);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [url, setHasConnected]);

  const sendMessage = useCallback((msg: Record<string, any>) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  }, []);

  // Convenience methods
  const createRoom = useCallback(() => {
    sendMessage({ command: 'create_room', room_name: roomName, username: yourName });
    console.log("Created room", roomName, yourName)
  }, [sendMessage, roomName, yourName]);

  const joinRoom = useCallback(() => {
    sendMessage({ command: 'join_room', room_name: roomName, username: yourName });
    console.log("Joined room", roomName, yourName)
  }, [sendMessage, roomName, yourName]);

  const beginGame = useCallback(() => {
    sendMessage({ command: 'begin_game', room_name: roomName });
    console.log("Started game", roomName)
  }, [sendMessage, roomName]);

  const viewRoom = useCallback(() => {
    sendMessage({ command: 'view_room', room_name: roomName });
  }, [sendMessage, roomName]);

  const getCardsAndCollections = useCallback(() => {
    sendMessage({ command: 'get_cards_and_collections', room_name: roomName });
    console.log("Got cards and collections", roomName)
  }, [sendMessage, roomName]);

  const doAction = useCallback(
    (action: string, action_args = {}) => {
      sendMessage({ command: 'action', room_name: roomName, username: yourName, action, action_args });
      viewRoom();
      console.log("Did action", action, action_args)
    },
    [sendMessage, roomName, yourName]
  );

  const debugWebSocketStatus = useCallback(() => {
    sendMessage({ command: 'debug_check_websocket_status', room_name: roomName, username: yourName });
  }, [sendMessage, roomName, yourName]);

  return {
    createRoom,
    joinRoom,
    beginGame,
    viewRoom,
    getCardsAndCollections,
    doAction,
    hasConnected,
    debugWebSocketStatus,
  };
}
