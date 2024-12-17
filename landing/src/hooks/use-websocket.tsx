// use-websocket.tsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast'

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
  room_name: string, 
  action: string, 
  action_args: Record<string, any>
) => void

export function useWebSocket(url: string = 'ws://localhost:8000/ws') {
  const socketRef = useRef<WebSocket | null>(null);
  const [hasConnected, setHasConnected] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      setHasConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);

        console.log("Received message", data);
        
        switch (data.type) {
          case 'game_state_update':
            console.log("Setting game state", data.gameState);
            break;

          case 'notification':
            console.log('Notification:', data.message);
            toast({
              title: data.message,
              variant: 'default',
            })
            break;

          case 'error':
            console.error('Error:', data.message || data.error);
            toast({
              title: data.message || data.error,
              variant: 'destructive',
            })
            break;

          case 'info':
            console.log('Info:', data.message);
            toast({
              title: data.message,
              variant: 'default',
            })
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
  const createRoom = useCallback((room_name: string, username: string) => {
    sendMessage({ command: 'create_room', room_name, username });
  }, [sendMessage]);

  const joinRoom = useCallback((room_name: string, username: string) => {
    sendMessage({ command: 'join_room', room_name, username });
  }, [sendMessage]);

  const beginGame = useCallback((room_name: string) => {
    sendMessage({ command: 'begin_game', room_name });
  }, [sendMessage]);

  const viewRoom = useCallback((room_name: string) => {
    sendMessage({ command: 'view_room', room_name });
  }, [sendMessage]);

  const getCardsAndCollections = useCallback((room_name: string) => {
    sendMessage({ command: 'get_cards_and_collections', room_name });
  }, [sendMessage]);

  const doAction = useCallback(
    (room_name: string, action: string, action_args = {}, username: string) => {
      sendMessage({ command: 'action', room_name, username, action, action_args });
      viewRoom(room_name);
    },
    [sendMessage]
  );

  const debugWebSocketStatus = useCallback((room_name: string, username: string) => {
    sendMessage({ command: 'debug_check_websocket_status', room_name, username });
  }, [sendMessage]);

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
