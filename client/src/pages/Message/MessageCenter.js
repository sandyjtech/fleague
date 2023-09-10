import React, { useState } from 'react';
import './Message.css';
import DirectMessage from './DirectMessage';
import LeagueChat from './LeagueChat';

const Message = () => {
  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState('call');

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="message-container">
      <div className="tab-buttons">
        <button
          className={activeTab === 'call' ? 'active-tab' : ''}
          onClick={() => handleTabClick('call')}
        >
          Direct Message
        </button>
        <button
          className={activeTab === 'chat' ? 'active-tab' : ''}
          onClick={() => handleTabClick('chat')}
        >
          League Chat
        </button>
      </div>
      <div className="tab-content">
        {/* Conditional rendering of components */}
        {activeTab === 'call' && <DirectMessage />}
        {activeTab === 'chat' && <LeagueChat/>}
      </div>
    </div>
  );
};

export default Message;
