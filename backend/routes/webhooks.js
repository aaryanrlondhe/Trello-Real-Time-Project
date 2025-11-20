const express = require('express');
const router = express.Router();
const trelloService = require('../services/trelloService');

// POST /api/webhooks/trello - Trello webhook callback endpoint
router.post('/trello', (req, res) => {
  try {
    const webhookData = req.body;
    const io = req.app.get('io');
    
    console.log('Received Trello webhook:', JSON.stringify(webhookData, null, 2));
    
    // Extract relevant information from the webhook
    const { action, model } = webhookData;
    
    if (!action || !action.type) {
      console.warn('Invalid webhook data received');
      return res.status(200).send('OK'); // Always respond with 200 to avoid webhook retry
    }
    
    // Normalize the webhook event for consistent broadcasting
    const normalizedEvent = normalizeWebhookEvent(action, model);
    
    if (normalizedEvent) {
      // Broadcast to all clients or specific board clients
      const boardId = normalizedEvent.boardId;
      
      if (boardId) {
        io.to(`board-${boardId}`).emit('trello-event', normalizedEvent);
        console.log(`Broadcasted event to board-${boardId}:`, normalizedEvent.type);
      } else {
        io.emit('trello-event', normalizedEvent);
        console.log('Broadcasted global event:', normalizedEvent.type);
      }
    }
    
    // Always respond with 200 OK to acknowledge receipt
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    // Still return 200 to avoid webhook retry loops
    res.status(200).send('OK');
  }
});

// GET /api/webhooks/trello - For Trello webhook verification (HEAD request)
router.get('/trello', (req, res) => {
  console.log('Webhook verification request received');
  res.status(200).send('Webhook endpoint ready');
});

// HEAD /api/webhooks/trello - For Trello webhook verification
router.head('/trello', (req, res) => {
  console.log('Webhook HEAD verification request received');
  res.status(200).end();
});

// POST /api/webhooks/register - Register a new webhook with Trello
router.post('/register', async (req, res) => {
  try {
    const { callbackURL, modelId } = req.body;
    
    if (!callbackURL || !modelId) {
      return res.status(400).json({ 
        error: 'callbackURL and modelId are required',
        requiredFields: ['callbackURL', 'modelId']
      });
    }

    const webhook = await trelloService.createWebhook(callbackURL, modelId);
    
    res.status(201).json({
      success: true,
      data: webhook,
      message: 'Webhook registered successfully'
    });
  } catch (error) {
    console.error('Webhook registration error:', error.message);
    res.status(500).json({
      error: 'Failed to register webhook',
      message: error.message
    });
  }
});

// GET /api/webhooks - Get all webhooks
router.get('/', async (req, res) => {
  try {
    const webhooks = await trelloService.getWebhooks();
    
    res.json({
      success: true,
      data: webhooks
    });
  } catch (error) {
    console.error('Get webhooks error:', error.message);
    res.status(500).json({
      error: 'Failed to get webhooks',
      message: error.message
    });
  }
});

// DELETE /api/webhooks/:webhookId - Delete a webhook
router.delete('/:webhookId', async (req, res) => {
  try {
    const { webhookId } = req.params;
    
    if (!webhookId) {
      return res.status(400).json({ 
        error: 'Webhook ID is required' 
      });
    }

    const result = await trelloService.deleteWebhook(webhookId);
    
    res.json({
      success: true,
      data: result,
      message: 'Webhook deleted successfully'
    });
  } catch (error) {
    console.error('Webhook deletion error:', error.message);
    res.status(500).json({
      error: 'Failed to delete webhook',
      message: error.message
    });
  }
});

// Helper function to normalize Trello webhook events into consistent format
function normalizeWebhookEvent(action, model) {
  const { type, data, date, memberCreator } = action;
  
  // Extract board ID from various possible locations
  let boardId = null;
  if (data.board) {
    boardId = data.board.id;
  } else if (data.card && data.card.idBoard) {
    boardId = data.card.idBoard;
  } else if (data.list && data.list.idBoard) {
    boardId = data.list.idBoard;
  } else if (model && model.id) {
    boardId = model.id;
  }
  
  const baseEvent = {
    type: type.toUpperCase(),
    timestamp: date,
    boardId,
    member: memberCreator,
    raw: action
  };
  
  // Handle different action types
  switch (type) {
    case 'createCard':
      return {
        ...baseEvent,
        type: 'CARD_CREATED_WEBHOOK',
        data: data.card,
        listId: data.list ? data.list.id : null
      };
      
    case 'updateCard':
      return {
        ...baseEvent,
        type: 'CARD_UPDATED_WEBHOOK',
        data: data.card,
        changes: data.old || {},
        listBefore: data.listBefore,
        listAfter: data.listAfter
      };
      
    case 'deleteCard':
      return {
        ...baseEvent,
        type: 'CARD_DELETED_WEBHOOK',
        data: { id: data.card ? data.card.id : null },
        listId: data.list ? data.list.id : null
      };
      
    case 'createBoard':
      return {
        ...baseEvent,
        type: 'BOARD_CREATED_WEBHOOK',
        data: data.board
      };
      
    case 'updateBoard':
      return {
        ...baseEvent,
        type: 'BOARD_UPDATED_WEBHOOK',
        data: data.board,
        changes: data.old || {}
      };
      
    case 'createList':
      return {
        ...baseEvent,
        type: 'LIST_CREATED_WEBHOOK',
        data: data.list
      };
      
    case 'updateList':
      return {
        ...baseEvent,
        type: 'LIST_UPDATED_WEBHOOK',
        data: data.list,
        changes: data.old || {}
      };
      
    default:
      console.log(`Unhandled webhook action type: ${type}`);
      return {
        ...baseEvent,
        type: 'UNKNOWN_WEBHOOK',
        data: data
      };
  }
}

module.exports = router;