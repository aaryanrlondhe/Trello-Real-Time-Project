import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useBoard = (boardId) => {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    try {
      const [boardResponse, listsResponse] = await Promise.all([
        apiService.getBoard(boardId),
        apiService.getBoardLists(boardId)
      ]);

      const boardData = boardResponse.data || boardResponse;
      const listsData = listsResponse.data || listsResponse;
      
      setBoard(boardData);
      setLists(listsData || []);
    } catch (err) {
      console.error('Error fetching board:', err);
      setError(err.message || 'Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const createBoard = useCallback(async (boardData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Creating board with data:', boardData);
      const response = await apiService.createBoard(boardData);
      const createdBoard = response.data || response; // Handle both response formats
      
      console.log('Board created successfully:', createdBoard);
      setBoard(createdBoard);
      return createdBoard;
    } catch (err) {
      console.error('Error creating board:', err);
      const errorMessage = err.message || 'Failed to create board';
      setError(errorMessage);
      
      // Re-throw the error
      const errorObj = new Error(errorMessage);
      errorObj.code = err.code || 500;
      errorObj.details = err.details;
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCardFromLists = useCallback((cardId) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        cards: (list.cards || []).filter((card) => card.id !== cardId),
      }))
    );
  }, []);

  const refreshBoard = useCallback(() => {
    fetchBoard();
  }, [fetchBoard]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return {
    board,
    lists,
    loading,
    error,
    createBoard,
    refreshBoard,
    setBoard,
    setLists,
    removeCardFromLists
  };
};