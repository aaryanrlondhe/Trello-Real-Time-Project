const express = require('express');
const router = express.Router();
const trelloService = require('../services/trelloService');

// POST /api/boards - Create new board
router.post('/', async (req, res) => {
  try {
    const { name, defaultLists = true } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'Board name is required',
        requiredFields: ['name']
      });
    }

    const board = await trelloService.createBoard(name, defaultLists);
    
    // Broadcast board creation to all connected clients
    const io = req.app.get('io');
    io.emit('board-created', {
      type: 'BOARD_CREATED',
      data: board,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      data: board,
      message: 'Board created successfully'
    });
  } catch (error) {
    console.error('Board creation error:', error.message);
    res.status(500).json({
      error: 'Failed to create board',
      message: error.message
    });
  }
});

// GET /api/boards/:boardId - Get board details with lists and cards
router.get('/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    
    if (!boardId) {
      return res.status(400).json({ 
        error: 'Board ID is required' 
      });
    }

    const board = await trelloService.getBoard(boardId);
    
    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Get board error:', error.message);
    res.status(500).json({
      error: 'Failed to get board',
      message: error.message
    });
  }
});

// GET /api/boards/:boardId/lists - Get lists for a board
router.get('/:boardId/lists', async (req, res) => {
  try {
    const { boardId } = req.params;
    
    if (!boardId) {
      return res.status(400).json({ 
        error: 'Board ID is required' 
      });
    }

    const lists = await trelloService.getBoardLists(boardId);
    
    res.json({
      success: true,
      data: lists
    });
  } catch (error) {
    console.error('Get board lists error:', error.message);
    res.status(500).json({
      error: 'Failed to get board lists',
      message: error.message
    });
  }
});

module.exports = router;