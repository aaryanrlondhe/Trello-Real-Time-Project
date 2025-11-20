const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class TrelloService {
  constructor() {
    this.apiKey = process.env.TRELLO_API_KEY;
    this.apiToken = process.env.TRELLO_API_TOKEN;
    this.baseUrl = 'https://api.trello.com/1';
    this.testMode = process.env.TEST_MODE === 'true' || !this.apiKey || !this.apiToken;
    
    // Mock data store for testing
    this.mockBoards = {};
    this.mockCards = {};
    this.mockLists = {};
    
    if (this.testMode) {
      console.log('⚠️  TEST MODE ENABLED - Using mock data instead of Trello API');
      console.log('To use real Trello API, set valid TRELLO_API_KEY and TRELLO_API_TOKEN');
    } else {
      console.log('✓ Trello API configured with valid credentials');
    }
  }

  // Helper method to build URL with auth params
  buildUrl(endpoint, additionalParams = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('token', this.apiToken);
    
    Object.keys(additionalParams).forEach(key => {
      if (additionalParams[key] !== undefined && additionalParams[key] !== null) {
        url.searchParams.append(key, additionalParams[key]);
      }
    });
    
    return url.toString();
  }

  // Board operations
  async createBoard(name, defaultLists = true) {
    try {
      // Test mode - return mock data
      if (this.testMode) {
        const boardId = `board_${uuidv4().substr(0, 8)}`;
        const board = {
          id: boardId,
          name,
          desc: '',
          url: `https://trello.com/b/${boardId}`,
          closed: false,
          lists: []
        };
        
        // Create default lists if requested
        if (defaultLists) {
          const listNames = [
            'To Do',
            'High Priority',
            'In Progress',
            'Review / QA',
            'Blocked',
            'On Hold',
            'Ideas / Brainstorm',
            'Done'
          ];
          board.lists = listNames.map((listName, idx) => ({
            id: `list_${uuidv4().substr(0, 8)}`,
            name: listName,
            idBoard: boardId,
            cards: []
          }));
        }
        
        this.mockBoards[boardId] = board;
        console.log(`[TEST MODE] Board created: ${boardId} - ${name}`);
        return board;
      }
      
      // Real Trello API mode
      const url = this.buildUrl('/boards', {
        name,
        defaultLists: defaultLists.toString()
      });
      
      const response = await axios.post(url);
      return response.data;
    } catch (error) {
      console.error('Error creating board:', error.response?.data || error.message);
      throw new Error(`Failed to create board: ${error.response?.data?.message || error.message}`);
    }
  }

  async getBoard(boardId) {
    try {
      // Test mode - return mock data
      if (this.testMode) {
        const board = this.mockBoards[boardId];
        if (!board) {
          throw new Error(`Board not found: ${boardId}`);
        }
        console.log(`[TEST MODE] Board retrieved: ${boardId}`);
        return board;
      }
      
      // Real Trello API mode
      const url = this.buildUrl(`/boards/${boardId}`, {
        lists: 'open',
        cards: 'open'
      });
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting board:', error.response?.data || error.message);
      throw new Error(`Failed to get board: ${error.response?.data?.message || error.message}`);
    }
  }

  async getBoardLists(boardId) {
    try {
      // Test mode - return mock data
      if (this.testMode) {
        const board = this.mockBoards[boardId];
        if (!board) {
          throw new Error(`Board not found: ${boardId}`);
        }
        console.log(`[TEST MODE] Board lists retrieved for: ${boardId}`);
        return board.lists || [];
      }
      
      // Real Trello API mode
      const url = this.buildUrl(`/boards/${boardId}/lists`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting board lists:', error.response?.data || error.message);
      throw new Error(`Failed to get board lists: ${error.response?.data?.message || error.message}`);
    }
  }

  // Card operations
  async createCard(cardData) {
    try {
      const { boardId, listId, name, desc } = cardData;
      
      if (!listId || !name) {
        throw new Error('listId and name are required to create a card');
      }

      // Test mode - return mock data
      if (this.testMode) {
        const cardId = `card_${uuidv4().substr(0, 8)}`;
        const card = {
          id: cardId,
          name,
          desc: desc || '',
          idList: listId,
          idBoard: boardId,
          url: `https://trello.com/c/${cardId}`,
          closed: false
        };
        
        this.mockCards[cardId] = card;
        
        // Add to mock board's list
        if (boardId && this.mockBoards[boardId]) {
          const list = this.mockBoards[boardId].lists.find(l => l.id === listId);
          if (list) {
            list.cards.push(card);
          }
        }
        
        console.log(`[TEST MODE] Card created: ${cardId} - ${name}`);
        return card;
      }

      // Real Trello API mode
      const url = this.buildUrl('/cards', {
        idList: listId,
        name,
        desc: desc || ''
      });
      
      const response = await axios.post(url);
      return response.data;
    } catch (error) {
      console.error('Error creating card:', error.response?.data || error.message);
      throw new Error(`Failed to create card: ${error.response?.data?.message || error.message}`);
    }
  }

  async updateCard(cardId, updateData) {
    try {
      if (!cardId) {
        throw new Error('cardId is required to update a card');
      }

      // Test mode - return mock data
      if (this.testMode) {
        const card = this.mockCards[cardId];
        if (!card) {
          throw new Error(`Card not found: ${cardId}`);
        }
        
        // Handle moving card between lists
        if (updateData.idList && updateData.idList !== card.idList) {
          const oldListId = card.idList;
          const newListId = updateData.idList;
          const boardId = card.idBoard;
          
          // Find the board
          if (boardId && this.mockBoards[boardId]) {
            const board = this.mockBoards[boardId];
            
            // Remove card from old list
            const oldList = board.lists.find(l => l.id === oldListId);
            if (oldList) {
              oldList.cards = oldList.cards.filter(c => c.id !== cardId);
            }
            
            // Add card to new list
            const newList = board.lists.find(l => l.id === newListId);
            if (newList) {
              newList.cards.push(card);
            }
          }
        }
        
        Object.assign(card, updateData);
        console.log(`[TEST MODE] Card updated: ${cardId}`);
        return card;
      }

      // Real Trello API mode
      const url = this.buildUrl(`/cards/${cardId}`, updateData);
      const response = await axios.put(url);
      return response.data;
    } catch (error) {
      console.error('Error updating card:', error.response?.data || error.message);
      throw new Error(`Failed to update card: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteCard(cardId) {
    try {
      if (!cardId) {
        throw new Error('cardId is required to delete a card');
      }

      // Test mode - return mock data
      if (this.testMode) {
        const card = this.mockCards[cardId];
        if (!card) {
          throw new Error(`Card not found: ${cardId}`);
        }
        
        // Remove from mock cards
        delete this.mockCards[cardId];
        
        // Remove from board's list
        if (card.idBoard && this.mockBoards[card.idBoard]) {
          const board = this.mockBoards[card.idBoard];
          const list = board.lists.find(l => l.id === card.idList);
          if (list) {
            list.cards = list.cards.filter(c => c.id !== cardId);
          }
        }
        
        console.log(`[TEST MODE] Card deleted: ${cardId}`);
        return { success: true, id: cardId };
      }

      // Real Trello API mode
      // Set card as closed (archived) instead of permanent deletion
      const url = this.buildUrl(`/cards/${cardId}`, { closed: 'true' });
      const response = await axios.put(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting card:', error.response?.data || error.message);
      throw new Error(`Failed to delete card: ${error.response?.data?.message || error.message}`);
    }
  }

  async getCard(cardId) {
    try {
      // Test mode - return mock data
      if (this.testMode) {
        const card = this.mockCards[cardId];
        if (!card) {
          throw new Error(`Card not found: ${cardId}`);
        }
        console.log(`[TEST MODE] Card retrieved: ${cardId}`);
        return card;
      }

      // Real Trello API mode
      const url = this.buildUrl(`/cards/${cardId}`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting card:', error.response?.data || error.message);
      throw new Error(`Failed to get card: ${error.response?.data?.message || error.message}`);
    }
  }

  // Webhook operations
  async createWebhook(callbackURL, modelId) {
    try {
      const url = this.buildUrl('/webhooks', {
        callbackURL,
        idModel: modelId,
        description: 'Trello Real-time Sync Webhook'
      });
      
      const response = await axios.post(url);
      return response.data;
    } catch (error) {
      console.error('Error creating webhook:', error.response?.data || error.message);
      throw new Error(`Failed to create webhook: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteWebhook(webhookId) {
    try {
      const url = this.buildUrl(`/webhooks/${webhookId}`);
      await axios.delete(url);
      return { success: true };
    } catch (error) {
      console.error('Error deleting webhook:', error.response?.data || error.message);
      throw new Error(`Failed to delete webhook: ${error.response?.data?.message || error.message}`);
    }
  }

  async getWebhooks() {
    try {
      const url = this.buildUrl('/members/me/webhooks');
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting webhooks:', error.response?.data || error.message);
      throw new Error(`Failed to get webhooks: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new TrelloService();