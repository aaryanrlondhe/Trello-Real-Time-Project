import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Board from './components/Board';
import BoardSelector from './components/BoardSelector';
import ConnectionStatus from './components/ConnectionStatus';
import { useSocket } from './hooks/useSocket';
import { useBoard } from './hooks/useBoard';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  padding: 20px;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 25px 30px;
  margin-bottom: 0;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
  position: relative;
  z-index: 100;
  overflow: visible;
  animation: slideInLeft 0.8s ease-out;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px 20px 0 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(240, 147, 251, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  text-shadow: 0 2px 10px rgba(30, 60, 114, 0.3);
  
  &::before {
    content: '�';
    font-size: 38px;
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
    60% { transform: translateY(-4px); }
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 8px 0 0 0;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 5px rgba(102, 126, 234, 0.2);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  animation: slideInRight 0.8s ease-out;
`;

const BoardControlsContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: none;
  border-radius: 0 0 20px 20px;
  padding: 25px 30px;
  margin-bottom: 25px;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
  animation: slideInDown 0.8s ease-out;
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorBanner = styled.div`
  background: linear-gradient(135deg, #f5576c, #f093fb);
  color: white;
  padding: 18px 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 8px 32px rgba(245, 87, 108, 0.3);
  animation: scaleIn 0.5s ease-out;
  
  &::before {
    content: '⚠️';
    font-size: 22px;
    animation: glow 2s ease-in-out infinite;
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)); }
    50% { filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6)); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
  animation: fadeIn 0.8s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #667eea;
    border-right: 4px solid #f093fb;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

function App() {
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [socketStatus, setSocketStatus] = useState({ connected: false });
  
  // Initialize socket connection
  const socket = useSocket(currentBoardId);
  
  // Board management
  const { 
    board, 
    lists, 
    loading, 
    error, 
    createBoard, 
    refreshBoard, 
    setLists, 
    removeCardFromLists 
  } = useBoard(currentBoardId);

  // Socket event handlers
  useEffect(() => {
    const handleConnectionStatus = (status) => {
      setSocketStatus(status);
    };

    const handleCardCreated = (data) => {
      console.log('Real-time card created:', data);
      refreshBoard(); // Refresh to get updated data
    };

    const handleCardUpdated = (data) => {
      console.log('Real-time card updated:', data);
      refreshBoard(); // Refresh to get updated data
    };

    const handleCardDeleted = (data) => {
      console.log('Real-time card deleted:', data);
      // Immediately remove the card from the UI without waiting for refresh
      removeCardFromLists(data.data?.id || data.id);
      // Then refresh the board to ensure sync
      refreshBoard();
    };

    const handleTrelloEvent = (data) => {
      console.log('Trello event received:', data);
      // Handle real-time Trello webhook events
      refreshBoard();
    };

    const handleTrelloWebhook = (data) => {
      console.log('Trello webhook received:', data);
      // Handle webhook events for even more real-time updates
      refreshBoard();
    };

    // Set up event listeners
    socket.on('connection-status', handleConnectionStatus);
    socket.on('card-created', handleCardCreated);
    socket.on('card-updated', handleCardUpdated);
    socket.on('card-deleted', handleCardDeleted);
    socket.on('trello-event', handleTrelloEvent);
    socket.on('trello-webhook', handleTrelloWebhook);

    // Cleanup
    return () => {
      socket.off('connection-status', handleConnectionStatus);
      socket.off('card-created', handleCardCreated);
      socket.off('card-updated', handleCardUpdated);
      socket.off('card-deleted', handleCardDeleted);
      socket.off('trello-event', handleTrelloEvent);
      socket.off('trello-webhook', handleTrelloWebhook);
    };
  }, [socket, refreshBoard, removeCardFromLists]);

  const handleBoardSelect = (boardId) => {
    setCurrentBoardId(boardId);
  };

  const handleBoardCreate = async (boardData) => {
    try {
      const newBoard = await createBoard(boardData);
      setCurrentBoardId(newBoard.id);
      return newBoard;
    } catch (error) {
      console.error('Failed to create board:', error);
      throw error;
    }
  };

  return (
    <AppContainer>
      <Header>
        <div>
          <Title>Trello Real-time Board</Title>
          <Subtitle>Real-time collaborative task management with WebSocket sync</Subtitle>
        </div>
        <HeaderRight>
          <ConnectionStatus status={socketStatus} />
        </HeaderRight>
      </Header>

      <BoardControlsContainer>
        <BoardSelector
          currentBoardId={currentBoardId}
          onBoardSelect={handleBoardSelect}
          onBoardCreate={handleBoardCreate}
        />
      </BoardControlsContainer>

      {error && (
        <ErrorBanner>
          Error: {error}
        </ErrorBanner>
      )}

      {loading && (
        <LoadingContainer>
          <LoadingText>
            <div className="spinner"></div>
            <div>Loading board...</div>
          </LoadingText>
        </LoadingContainer>
      )}

      {!loading && currentBoardId && board && (
        <Board
          board={board}
          lists={lists}
          onListsChange={setLists}
          onRefresh={refreshBoard}
          removeCardFromLists={removeCardFromLists}
        />
      )}

      {!loading && !currentBoardId && (
        <LoadingContainer>
          <LoadingText>
            <div style={{ fontSize: '48px' }}>🎯</div>
            <div>Select or create a board to get started</div>
            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
              Use the board selector in the top-right corner
            </div>
          </LoadingText>
        </LoadingContainer>
      )}
    </AppContainer>
  );
}

export default App;