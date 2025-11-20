import React, { useState } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { useTasks } from '../hooks/useTasks';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #f093fb, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  &:hover {
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
    transform: translateY(-3px);
    
    &::before {
      opacity: 1;
    }
  }
  
  ${props => props.isDragging && `
    opacity: 0.7;
    transform: rotate(3deg) scale(0.95);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
    border-color: #667eea;
    
    &::before {
      opacity: 1;
    }
  `}
  
  ${props => props.isEditing && `
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    transform: scale(1.02);
    
    &::before {
      opacity: 1;
    }
  `}
`;

const CardTitle = styled.h4`
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  word-wrap: break-word;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(30, 60, 114, 0.1);
`;

const CardDescription = styled.p`
  color: #7f8c8d;
  font-size: 13px;
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-wrap: break-word;
  max-height: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  animation: slideInUp 0.5s ease-out 0.2s both;
  
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 
    'linear-gradient(135deg, #f5576c, #f093fb)' : 
    'linear-gradient(135deg, #667eea, #764ba2)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: ${props => props.danger ? 
    '0 3px 10px rgba(245, 87, 108, 0.3)' : 
    '0 3px 10px rgba(102, 126, 234, 0.3)'};
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
  
  &:hover:not(:disabled) {
    background: ${props => props.danger ? 
      'linear-gradient(135deg, #e84060, #f5576c)' : 
      'linear-gradient(135deg, #764ba2, #f093fb)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.danger ? 
      '0 6px 20px rgba(245, 87, 108, 0.4)' : 
      '0 6px 20px rgba(102, 126, 234, 0.4)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const CardMeta = styled.div`
  font-size: 10px;
  color: #bdc3c7;
  text-align: right;
  font-weight: 500;
  opacity: 0.8;
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: scaleIn 0.3s ease-out;
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const EditInput = styled.input`
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    border-color: #764ba2;
    background: rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const EditTextarea = styled.textarea`
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    border-color: #764ba2;
    background: rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  animation: slideInUp 0.3s ease-out 0.1s both;
  
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function Card({ card, listId, boardId, removeCardFromLists }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.name);
  const [editDescription, setEditDescription] = useState(card.desc || '');
  
  const { updateTask, deleteTask, loading } = useTasks();

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { cardId: card.id, sourceListId: listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    setEditTitle(card.name);
    setEditDescription(card.desc || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Card title cannot be empty');
      return;
    }

    try {
      await updateTask(card.id, {
        name: editTitle.trim(),
        desc: editDescription.trim()
      });
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update card: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditTitle(card.name);
    setEditDescription(card.desc || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      // Immediately remove from UI
      if (removeCardFromLists) {
        removeCardFromLists(card.id);
      }
      // Then delete from API
      await deleteTask(card.id);
    } catch (error) {
      alert('Failed to delete card: ' + error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <CardContainer isEditing={true}>
        <EditForm>
          <EditInput
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Card title..."
            autoFocus
          />
          <EditTextarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a description..."
          />
          <EditActions>
            <ActionButton onClick={handleCancel} disabled={loading}>
              Cancel
            </ActionButton>
            <ActionButton onClick={handleSave} disabled={loading || !editTitle.trim()}>
              {loading ? 'Saving...' : 'Save'}
            </ActionButton>
          </EditActions>
        </EditForm>
      </CardContainer>
    );
  }

  return (
    <CardContainer 
      ref={drag} 
      isDragging={isDragging}
      onClick={(e) => {
        // Don't trigger edit if clicking on action buttons
        if (!e.target.closest('button')) {
          handleEdit();
        }
      }}
    >
      <CardTitle>{card.name}</CardTitle>
      
      {card.desc && (
        <CardDescription>{card.desc}</CardDescription>
      )}
      
      <CardActions onClick={(e) => e.stopPropagation()}>
        <div>
          <ActionButton onClick={handleEdit} disabled={loading}>
            ✏️ Edit
          </ActionButton>
        </div>
        
        <ActionButton 
          danger 
          onClick={handleDelete} 
          disabled={loading}
        >
          🗑️ Delete
        </ActionButton>
      </CardActions>
      
      {card.dateLastActivity && (
        <CardMeta>
          Updated: {new Date(card.dateLastActivity).toLocaleDateString()}
        </CardMeta>
      )}
    </CardContainer>
  );
}

export default Card;