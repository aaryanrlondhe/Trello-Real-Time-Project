import React, { useState } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import List from './List';
import { useTasks } from '../hooks/useTasks';

const BoardContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
  min-height: 600px;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #f093fb, #4facfe);
    animation: shimmer 3s infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  animation: slideInLeft 0.6s ease-out;
`;

const BoardTitle = styled.h2`
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '📊';
    font-size: 32px;
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
    60% { transform: translateY(-3px); }
  }
`;

const BoardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 500;
  animation: slideInRight 0.6s ease-out;
  
  span {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 8px 15px;
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const ListsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  padding-bottom: 25px;
  min-height: auto;
  animation: slideInLeft 0.8s ease-out 0.2s both;
  
  @media (max-width: 1920px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  animation: fadeIn 1s ease-out;
  
  .icon {
    font-size: 80px;
    margin-bottom: 20px;
    animation: bounce 2s ease-in-out infinite;
  }
  
  .message {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
    text-shadow: 0 2px 10px rgba(30, 60, 114, 0.3);
  }
  
  .description {
    font-size: 16px;
    opacity: 0.8;
    max-width: 400px;
    line-height: 1.5;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #764ba2, #f093fb);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

function Board({ board, lists, onListsChange, onRefresh, removeCardFromLists }) {
  const { updateTask } = useTasks();
  const [dragOverList, setDragOverList] = useState(null);
  
  // Provide a default implementation if not passed
  const handleRemoveCard = removeCardFromLists || ((cardId) => {
    onListsChange((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        cards: (list.cards || []).filter((card) => card.id !== cardId),
      }))
    );
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    drop: async (item, monitor) => {
      const dropResult = monitor.getDropResult();
      const { cardId, sourceListId } = item;
      const targetListId = dropResult?.listId || dragOverList;
      
      if (!targetListId || !cardId) {
        setDragOverList(null);
        return;
      }

      if (sourceListId === targetListId) {
        setDragOverList(null);
        return;
      }

      try {
        // Update card's list
        await updateTask(cardId, { idList: targetListId });
        console.log(`Moved card ${cardId} from list ${sourceListId} to list ${targetListId}`);
        
        // Refresh board to get updated data
        onRefresh();
      } catch (error) {
        console.error('Error moving card:', error);
        alert('Failed to move card: ' + (error.message || 'Unknown error'));
      }
      
      setDragOverList(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (!board || !lists) {
    return (
      <BoardContainer>
        <EmptyState>
          <div className="icon">📋</div>
          <div className="message">Board not found</div>
          <div className="description">The board you're looking for doesn't exist or couldn't be loaded.</div>
        </EmptyState>
      </BoardContainer>
    );
  }

  if (lists.length === 0) {
    return (
      <BoardContainer ref={drop}>
        <BoardHeader>
          <BoardTitle>{board.name}</BoardTitle>
          <BoardMeta>
            <RefreshButton onClick={onRefresh}>
              🔄 Refresh
            </RefreshButton>
          </BoardMeta>
        </BoardHeader>
        
        <EmptyState>
          <div className="icon">📝</div>
          <div className="message">No lists found</div>
          <div className="description">This board doesn't have any lists yet. Create lists in Trello to get started.</div>
        </EmptyState>
      </BoardContainer>
    );
  }

  return (
    <BoardContainer ref={drop}>
      <BoardHeader>
        <BoardTitle>{board.name}</BoardTitle>
        <BoardMeta>
          <span>📊 {lists.length} list{lists.length !== 1 ? 's' : ''}</span>
          <span>🎯 {lists.reduce((total, list) => total + (list.cards?.length || 0), 0)} card{lists.reduce((total, list) => total + (list.cards?.length || 0), 0) !== 1 ? 's' : ''}</span>
          <RefreshButton onClick={onRefresh}>
            🔄 Refresh
          </RefreshButton>
        </BoardMeta>
      </BoardHeader>

      <ListsContainer>
        {lists.map((list) => (
          <List
            key={list.id}
            list={list}
            boardId={board.id}
            onDragOver={setDragOverList}
            isDragOver={dragOverList === list.id}
            removeCardFromLists={handleRemoveCard}
            onRefresh={onRefresh}
          />
        ))}
      </ListsContainer>
    </BoardContainer>
  );
}

export default Board;