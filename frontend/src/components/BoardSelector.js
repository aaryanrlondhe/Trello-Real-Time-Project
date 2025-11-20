import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useBoard } from '../hooks/useBoard';

const SelectorContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0;
`;

const SelectorButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  align-self: flex-start;
  
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
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: #2c3e50;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
  position: relative;
  overflow: hidden;
  align-self: flex-start;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #f5576c, #e84060);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Dropdown = styled.div`
  width: 100%;
  background: transparent;
  border: none;
  box-shadow: none;
  z-index: 100;
  max-width: none;
  max-height: none;
  overflow: visible;
  animation: slideInDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-15px);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }
`;

const DropdownSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  animation: fadeIn 0.6s ease-out;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:first-child {
    border-radius: 16px 16px 0 0;
    border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
    border-radius: 0 0 16px 16px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 3px;
    height: 15px;
    background: linear-gradient(135deg, #3498db, #f4d03f);
    border-radius: 2px;
  }
`;

const BoardInput = styled.input`
  width: 100%;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const BoardButton = styled.button`
  width: 100%;
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  padding: 12px 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #667eea, #764ba2)' : 
    'linear-gradient(135deg, #95a5a6, #7f8c8d)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 10px;
  box-shadow: ${props => props.primary ? 
    '0 3px 10px rgba(102, 126, 234, 0.3)' : 
    '0 3px 10px rgba(149, 165, 166, 0.3)'};
  
  &:hover:not(:disabled) {
    background: ${props => props.primary ? 
      'linear-gradient(135deg, #764ba2, #f093fb)' : 
      'linear-gradient(135deg, #7f8c8d, #6c7b7f)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.primary ? 
      '0 6px 20px rgba(102, 126, 234, 0.4)' : 
      '0 6px 20px rgba(149, 165, 166, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f5576c;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
  padding: 10px 15px;
  background: rgba(245, 87, 108, 0.1);
  border-radius: 10px;
  border-left: 3px solid #f5576c;
  animation: shake 0.5s ease-in-out;
  line-height: 1.4;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
  
  .error-code {
    font-size: 10px;
    background: #f5576c;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 6px;
    font-weight: 700;
  }
  
  .error-details {
    margin-top: 6px;
    font-size: 11px;
    color: #d63447;
    font-style: italic;
  }
`;

const RecentBoards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

function BoardSelector({ currentBoardId, onBoardSelect, onBoardCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [error, setError] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [recentBoards] = useState([
    // Mock recent boards - in a real app, this would come from localStorage or API
    { id: '64a1b2c3d4e5f6789abcdef0', name: 'Sample Board 1' },
    { id: '64a1b2c3d4e5f6789abcdef1', name: 'Sample Board 2' },
    { id: '64a1b2c3d4e5f6789abcdef2', name: 'Sample Board 3' },
  ]);
  
  const { loading } = useBoard();
  const dropdownRef = useRef(null);
  const selectorRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCreateForm(false);
        setNewBoardName('');
        setError(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && selectorRef.current) {
      const rect = selectorRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isOpen]);

  const handleBoardSelect = (boardId) => {
    onBoardSelect(boardId);
    setIsOpen(false);
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) {
      setError('Board name is required');
      return;
    }

    setError('');

    try {
      await onBoardCreate({
        name: newBoardName.trim(),
        defaultLists: true
      });
      
      setNewBoardName('');
      setShowCreateForm(false);
      setIsOpen(false);
    } catch (err) {
      console.error('Board creation error:', err);
      
      let errorMessage = 'Failed to create board';
      let errorCode = null;
      let errorDetails = null;
      
      if (err.code === 401) {
        errorMessage = 'Authentication failed. Please check your Trello API credentials.';
        errorCode = 401;
        errorDetails = 'Make sure your Trello API key and token are valid';
      } else if (err.code === 403) {
        errorMessage = 'Permission denied. Check your Trello API token permissions.';
        errorCode = 403;
        errorDetails = 'Your token may not have write access to create boards';
      } else if (err.code === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
        errorCode = 429;
      } else if (err.code >= 500) {
        errorMessage = 'Server error. Please try again.';
        errorCode = err.code;
      } else if (err.message) {
        errorMessage = err.message;
        errorCode = err.code;
      }
      
      setError({
        message: errorMessage,
        code: errorCode,
        details: errorDetails
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateBoard();
    } else if (e.key === 'Escape') {
      setShowCreateForm(false);
      setNewBoardName('');
      setError(null);
    }
  };

  const getCurrentBoardName = () => {
    const current = recentBoards.find(board => board.id === currentBoardId);
    return current ? current.name : 'Select Board';
  };

  return (
    <SelectorContainer ref={selectorRef}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <SelectorButton onClick={() => setIsOpen(!isOpen)}>
          <span>📋 {getCurrentBoardName()}</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </SelectorButton>
        
        <CreateButton onClick={() => {
          setShowCreateForm(true);
          setIsOpen(true);
        }}>
          ➕ New Board
        </CreateButton>
      </div>

      {isOpen && (
        <Dropdown ref={dropdownRef}>
          {showCreateForm && (
            <DropdownSection>
              <SectionTitle>Create New Board</SectionTitle>
              <BoardInput
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter board name..."
                autoFocus
                disabled={loading}
              />
              
              {error && (
                <ErrorMessage>
                  <div>
                    {typeof error === 'string' ? error : error.message}
                    {error.code && <span className="error-code">{error.code}</span>}
                  </div>
                  {error.details && (
                    <div className="error-details">{error.details}</div>
                  )}
                </ErrorMessage>
              )}
              
              <div>
                <ActionButton 
                  primary 
                  onClick={handleCreateBoard}
                  disabled={loading || !newBoardName.trim()}
                >
                  {loading ? 'Creating...' : 'Create'}
                </ActionButton>
                <ActionButton 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewBoardName('');
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </ActionButton>
              </div>
            </DropdownSection>
          )}
          
          <DropdownSection>
            <SectionTitle>Enter Board ID</SectionTitle>
            <BoardInput
              type="text"
              placeholder="Paste Trello board ID here..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleBoardSelect(e.target.value.trim());
                }
              }}
            />
          </DropdownSection>
          
          {recentBoards.length > 0 && (
            <DropdownSection>
              <SectionTitle>Sample Board IDs</SectionTitle>
              <RecentBoards>
                {recentBoards.map((board) => (
                  <BoardButton
                    key={board.id}
                    onClick={() => handleBoardSelect(board.id)}
                  >
                    <div style={{ fontWeight: 500 }}>{board.name}</div>
                    <div style={{ fontSize: '11px', color: '#6c757d', fontFamily: 'monospace' }}>
                      {board.id}
                    </div>
                  </BoardButton>
                ))}
              </RecentBoards>
            </DropdownSection>
          )}
        </Dropdown>
      )}
    </SelectorContainer>
  );
}

export default BoardSelector;