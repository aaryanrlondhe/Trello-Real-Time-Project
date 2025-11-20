import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error('API Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  // Board operations
  async createBoard(boardData) {
    try {
      const response = await this.api.post('/api/boards', boardData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBoard(boardId) {
    try {
      const response = await this.api.get(`/api/boards/${boardId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBoardLists(boardId) {
    try {
      const response = await this.api.get(`/api/boards/${boardId}/lists`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Task/Card operations
  async createTask(taskData) {
    try {
      const response = await this.api.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTask(cardId, updateData) {
    try {
      const response = await this.api.put(`/api/tasks/${cardId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTask(cardId) {
    try {
      const response = await this.api.delete(`/api/tasks/${cardId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTask(cardId) {
    try {
      const response = await this.api.get(`/api/tasks/${cardId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Webhook operations
  async registerWebhook(webhookData) {
    try {
      const response = await this.api.post('/api/webhooks/register', webhookData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWebhooks() {
    try {
      const response = await this.api.get('/api/webhooks');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteWebhook(webhookId) {
    try {
      const response = await this.api.delete(`/api/webhooks/${webhookId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling helper
  handleError(error) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';
    const errorCode = error.response?.status || 500;
    
    const errorObj = new Error(errorMessage);
    errorObj.code = errorCode;
    errorObj.details = error.response?.data || null;
    return errorObj;
  }
}

export default new ApiService();