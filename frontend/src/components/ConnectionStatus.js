import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 15px;
  background: ${props => props.connected ? 
    'rgba(102, 126, 234, 0.1)' : 
    'rgba(245, 87, 108, 0.1)'};
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.connected ? '#667eea' : '#f5576c'};
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.connected ? '#667eea' : '#d63447'};
  min-width: 140px;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.connected ? 
    '0 4px 15px rgba(102, 126, 234, 0.2)' : 
    '0 4px 15px rgba(245, 87, 108, 0.2)'};
  animation: slideIn 0.6s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.connected ? 
      '0 8px 25px rgba(102, 126, 234, 0.3)' : 
      '0 8px 25px rgba(245, 87, 108, 0.3)'};
  }
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.connected ? 
    'linear-gradient(135deg, #667eea, #764ba2)' : 
    'linear-gradient(135deg, #f5576c, #f093fb)'};
  animation: ${props => props.connected ? 'pulse-success' : 'pulse-error'} 2s infinite;
  box-shadow: ${props => props.connected ? 
    '0 0 10px rgba(102, 126, 234, 0.5)' : 
    '0 0 10px rgba(245, 87, 108, 0.5)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 2px solid ${props => props.connected ? '#667eea' : '#f5576c'};
    border-radius: 50%;
    opacity: 0;
    animation: ripple 2s infinite;
  }
  
  @keyframes pulse-success {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(102, 126, 234, 0.7);
    }
  }
  
  @keyframes pulse-error {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 10px rgba(245, 87, 108, 0.5);
    }
    50% { 
      transform: scale(0.9);
      box-shadow: 0 0 15px rgba(245, 87, 108, 0.7);
    }
  }
  
  @keyframes ripple {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }
`;

const StatusText = styled.span`
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const SocketId = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 3px;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
`;

function ConnectionStatus({ status }) {
  const [connectionHistory, setConnectionHistory] = useState([]);
  
  useEffect(() => {
    // Track connection changes
    setConnectionHistory(prev => [
      ...prev.slice(-4), // Keep last 5 entries
      {
        connected: status.connected,
        timestamp: new Date(),
        socketId: status.socketId,
        reason: status.reason
      }
    ]);
  }, [status.connected, status.socketId]);

  const getStatusText = () => {
    if (status.connected) {
      return 'Connected';
    } else {
      return 'Disconnected';
    }
  };

  const getTooltipText = () => {
    const history = connectionHistory.slice(-3).map(entry => 
      `${entry.connected ? '✅' : '❌'} ${entry.timestamp.toLocaleTimeString()}`
    ).join('\n');
    
    return `WebSocket Status\n${history}\n\nSocket ID: ${status.socketId || 'N/A'}`;
  };

  return (
    <StatusContainer 
      connected={status.connected}
      title={getTooltipText()}
    >
      <StatusIndicator connected={status.connected} />
      <div>
        <StatusText>{getStatusText()}</StatusText>
        {status.socketId && (
          <SocketId>
            ID: {status.socketId.substring(0, 8)}...
          </SocketId>
        )}
      </div>
    </StatusContainer>
  );
}

export default ConnectionStatus;