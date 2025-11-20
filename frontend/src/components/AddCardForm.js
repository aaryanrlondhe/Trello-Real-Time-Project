import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTasks } from '../hooks/useTasks';

const FormContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(102, 126, 234, 0.1));
  backdrop-filter: blur(15px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.2);
  animation: scaleIn 0.4s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #f093fb, #764ba2);
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const FormInput = styled.input`
  width: 100%;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #bdc3c7;
    font-weight: 500;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 15px;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #bdc3c7;
    font-weight: 500;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  animation: slideInUp 0.5s ease-out 0.2s both;
  
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #667eea, #764ba2)' : 
    'linear-gradient(135deg, #95a5a6, #7f8c8d)'};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${props => props.primary ? 
    '0 4px 15px rgba(102, 126, 234, 0.3)' : 
    '0 4px 15px rgba(149, 165, 166, 0.3)'};
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
    background: ${props => props.primary ? 
      'linear-gradient(135deg, #764ba2, #f093fb)' : 
      'linear-gradient(135deg, #7f8c8d, #6c7b7f)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? 
      '0 8px 25px rgba(102, 126, 234, 0.4)' : 
      '0 8px 25px rgba(149, 165, 166, 0.4)'};
    
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

const ErrorMessage = styled.div`
  color: #f5576c;
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
  margin-bottom: 12px;
  padding: 10px 15px;
  background: rgba(245, 87, 108, 0.1);
  border-radius: 8px;
  border-left: 4px solid #f5576c;
  animation: shake 0.5s ease-in-out;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

function AddCardForm({ listId, boardId, onCancel, onSuccess, onRefresh }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const { createTask, loading } = useTasks();
  const titleInputRef = useRef(null);

  // Focus on title input when component mounts
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Card title is required');
      return;
    }

    setError('');

    try {
      await createTask({
        boardId,
        listId,
        name: title.trim(),
        desc: description.trim()
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      
      // Refresh board to fetch the newly created card with drag support
      if (onRefresh) {
        await onRefresh();
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to create card');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormInput
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter card title..."
          disabled={loading}
          maxLength={500}
        />
        
        <FormTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a description (optional)..."
          disabled={loading}
          maxLength={16384}
        />
        
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        
        <FormActions>
          <ActionButton 
            type="button" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </ActionButton>
          
          <ActionButton 
            type="submit" 
            primary
            disabled={loading || !title.trim()}
          >
            {loading ? (
              <>
                <span>⏳</span>
                Adding...
              </>
            ) : (
              <>
                <span>➕</span>
                Add Card
              </>
            )}
          </ActionButton>
        </FormActions>
      </form>
      
      <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '8px', textAlign: 'center' }}>
        Press Ctrl+Enter to submit, Esc to cancel
      </div>
    </FormContainer>
  );
}

export default AddCardForm;