const express = require('express');
const router = express.Router();
const trelloService = require('../services/trelloService');

// POST /api/tasks - Create new card/task
router.post('/', async (req, res) => {
  try {
    const { boardId, listId, name, desc } = req.body;
    
    if (!listId || !name) {
      return res.status(400).json({ 
        error: 'listId and name are required',
        requiredFields: ['listId', 'name']
      });
    }

    const cardData = { boardId, listId, name, desc };
    const card = await trelloService.createCard(cardData);
    
    // Broadcast card creation to clients connected to this board
    const io = req.app.get('io');
    if (boardId) {
      io.to(`board-${boardId}`).emit('card-created', {
        type: 'CARD_CREATED',
        data: card,
        boardId,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(201).json({
      success: true,
      data: card,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Task creation error:', error.message);
    res.status(500).json({
      error: 'Failed to create task',
      message: error.message
    });
  }
});

// PUT /api/tasks/:cardId - Update existing card/task
router.put('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const updateData = req.body;
    
    if (!cardId) {
      return res.status(400).json({ 
        error: 'Card ID is required' 
      });
    }

    // Get the card first to know which board it belongs to for broadcasting
    let originalCard;
    try {
      originalCard = await trelloService.getCard(cardId);
    } catch (error) {
      // Card might not exist or be accessible
      console.warn('Could not fetch original card for broadcasting:', error.message);
    }

    const updatedCard = await trelloService.updateCard(cardId, updateData);
    
    // Broadcast card update to relevant board clients
    const io = req.app.get('io');
    if (originalCard && originalCard.idBoard) {
      io.to(`board-${originalCard.idBoard}`).emit('card-updated', {
        type: 'CARD_UPDATED',
        data: updatedCard,
        originalData: originalCard,
        boardId: originalCard.idBoard,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: updatedCard,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Task update error:', error.message);
    res.status(500).json({
      error: 'Failed to update task',
      message: error.message
    });
  }
});

// DELETE /api/tasks/:cardId - Delete/archive card/task
router.delete('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    
    if (!cardId) {
      return res.status(400).json({ 
        error: 'Card ID is required' 
      });
    }

    // Get the card first to know which board it belongs to for broadcasting
    let originalCard;
    try {
      originalCard = await trelloService.getCard(cardId);
    } catch (error) {
      console.warn('Could not fetch original card for broadcasting:', error.message);
      // If card doesn't exist, still return 404 instead of trying to delete
      if (error.message.includes('not found') || error.message.includes('Card not found')) {
        return res.status(404).json({
          error: 'Card not found',
          message: `The card with ID ${cardId} does not exist or has already been deleted.`
        });
      }
    }

    try {
      const result = await trelloService.deleteCard(cardId);
      
      // Broadcast card deletion to relevant board clients
      const io = req.app.get('io');
      if (originalCard && originalCard.idBoard) {
        io.to(`board-${originalCard.idBoard}`).emit('card-deleted', {
          type: 'CARD_DELETED',
          data: { id: cardId, ...result },
          originalData: originalCard,
          boardId: originalCard.idBoard,
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        success: true,
        data: { id: cardId, ...result },
        message: 'Task deleted successfully'
      });
    } catch (deleteError) {
      console.error('Error during card deletion:', deleteError.message);
      // If card doesn't exist, return 404 instead of 500
      if (deleteError.message.includes('not found') || deleteError.message.includes('Card not found')) {
        return res.status(404).json({
          error: 'Card not found',
          message: `The card with ID ${cardId} does not exist or has already been deleted.`
        });
      }
      throw deleteError;
    }
  } catch (error) {
    console.error('Task deletion error:', error.message);
    res.status(500).json({
      error: 'Failed to delete task',
      message: error.message
    });
  }
});

// GET /api/tasks/:cardId - Get card details
router.get('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    
    if (!cardId) {
      return res.status(400).json({ 
        error: 'Card ID is required' 
      });
    }

    const card = await trelloService.getCard(cardId);
    
    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({
      error: 'Failed to get task',
      message: error.message
    });
  }
});

module.exports = router;