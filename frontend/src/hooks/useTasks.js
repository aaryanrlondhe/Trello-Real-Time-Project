import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

export const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.createTask(taskData);
      return response.data;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (cardId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.updateTask(cardId, updateData);
      return response.data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (cardId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.deleteTask(cardId);
      return response.data;
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (cardId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getTask(cardId);
      return response.data;
    } catch (err) {
      console.error('Error fetching task:', err);
      setError(err.message || 'Failed to fetch task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    loading,
    error,
    setError
  };
};