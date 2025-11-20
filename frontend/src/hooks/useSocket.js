import { useEffect, useRef } from 'react';
import socketService from '../services/socketService';

export const useSocket = (boardId = null) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      socketService.connect();
      isInitialized.current = true;
    }

    // Join board if provided
    if (boardId) {
      socketService.joinBoard(boardId);
    }

    // Cleanup function
    return () => {
      if (boardId) {
        socketService.leaveBoard(boardId);
      }
    };
  }, [boardId]);

  // Return socket service for direct access
  return socketService;
};