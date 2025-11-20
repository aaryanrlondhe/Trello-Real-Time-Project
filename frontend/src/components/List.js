import React, { useState } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import Card from './Card';
import AddCardForm from './AddCardForm';

const ListContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  min-width: 320px;
  max-width: 320px;
  height: fit-content;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: scaleIn 0.5s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #f093fb, #4facfe);
    border-radius: 16px 16px 0 0;
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  }
  
  ${props => props.isDragOver && `
    background: rgba(102, 126, 234, 0.1);
    border: 2px dashed #667eea;
    transform: scale(1.03);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
    animation: glow 0.5s ease-in-out;
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3); }
      50% { box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5); }
    }
  `}
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(52, 152, 219, 0.1);
  animation: slideInLeft 0.6s ease-out;
`;

const ListTitle = styled.h3`
  color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  word-break: break-word;
  text-shadow: 0 1px 3px rgba(30, 60, 114, 0.1);
`;

const CardCount = styled.span`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  margin-left: 15px;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 120px;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
  animation: fadeIn 0.8s ease-out 0.2s both;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(240, 147, 251, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #f093fb, #764ba2);
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #f5576c, #667eea);
    transform: scale(1.1);
  }
`;

const EmptyListMessage = styled.div`
  text-align: center;
  color: #7f8c8d;
  font-size: 15px;
  font-weight: 500;
  padding: 25px 15px;
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.05);
  animation: bounce 1s ease-in-out;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
    60% { transform: translateY(-2px); }
  }
`;

const AddCardButton = styled.button`
  width: 100%;
  background: rgba(102, 126, 234, 0.1);
  border: 2px dashed rgba(102, 126, 234, 0.4);
  border-radius: 12px;
  padding: 15px;
  color: #667eea;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    border-color: #667eea;
    color: #764ba2;
    background: rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  span {
    font-size: 18px;
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-3px); }
    60% { transform: translateY(-1px); }
  }
`;

function List({ list, boardId, onDragOver, isDragOver, removeCardFromLists, onRefresh }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: () => {
      // The drop is handled by the Board component
      return { listId: list.id };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: () => {
      onDragOver(list.id);
    },
  });

  const cards = list.cards || [];

  return (
    <ListContainer ref={drop} isDragOver={isDragOver || isOver}>
      <ListHeader>
        <ListTitle>{list.name}</ListTitle>
        <CardCount>{cards.length}</CardCount>
      </ListHeader>

      <CardsContainer>
        {cards.length === 0 ? (
          <EmptyListMessage>
            No cards yet. Add your first card below! 👇
          </EmptyListMessage>
        ) : (
          cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              listId={list.id}
              boardId={boardId}
              removeCardFromLists={removeCardFromLists}
            />
          ))
        )}
      </CardsContainer>

      {showAddForm ? (
        <AddCardForm
          listId={list.id}
          boardId={boardId}
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
          onRefresh={onRefresh}
        />
      ) : (
        <AddCardButton onClick={() => setShowAddForm(true)}>
          <span>➕</span>
          Add a card
        </AddCardButton>
      )}
    </ListContainer>
  );
}

export default List;