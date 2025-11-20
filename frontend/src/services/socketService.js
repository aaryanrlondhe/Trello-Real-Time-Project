import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.currentBoardId = null;
  }

  connect(serverUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001') {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    try {
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.setupEventListeners();
      console.log('Socket connection initiated to:', serverUrl);
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.emit('connection-status', { connected: true, socketId: this.socket.id });
      
      // Rejoin current board if we were already on one
      if (this.currentBoardId) {
        this.joinBoard(this.currentBoardId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection-status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection-error', { error: error.message });
    });

    // Real-time event listeners
    this.socket.on('card-created', (data) => {
      console.log('Card created event:', data);
      this.emit('card-created', data);
    });

    this.socket.on('card-updated', (data) => {
      console.log('Card updated event:', data);
      this.emit('card-updated', data);
    });

    this.socket.on('card-deleted', (data) => {
      console.log('Card deleted event:', data);
      this.emit('card-deleted', data);
    });

    this.socket.on('board-created', (data) => {
      console.log('Board created event:', data);
      this.emit('board-created', data);
    });

    this.socket.on('trello-event', (data) => {
      console.log('Trello event received:', data);
      this.emit('trello-event', data);
    });

    this.socket.on('trello-webhook', (data) => {
      console.log('Trello webhook event:', data);
      this.emit('trello-webhook', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentBoardId = null;
      console.log('Socket disconnected manually');
    }
  }

  joinBoard(boardId) {
    if (!this.socket || !boardId) {
      console.warn('Cannot join board: socket not connected or invalid board ID');
      return;
    }

    // Leave current board first
    if (this.currentBoardId && this.currentBoardId !== boardId) {
      this.leaveBoard(this.currentBoardId);
    }

    this.socket.emit('join-board', boardId);
    this.currentBoardId = boardId;
    console.log(`Joined board: ${boardId}`);
  }

  leaveBoard(boardId) {
    if (!this.socket || !boardId) {
      console.warn('Cannot leave board: socket not connected or invalid board ID');
      return;
    }

    this.socket.emit('leave-board', boardId);
    if (this.currentBoardId === boardId) {
      this.currentBoardId = null;
    }
    console.log(`Left board: ${boardId}`);
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const eventListeners = this.listeners.get(event);
    const index = eventListeners.indexOf(callback);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Utility methods
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      currentBoard: this.currentBoardId
    };
  }

  isSocketConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();