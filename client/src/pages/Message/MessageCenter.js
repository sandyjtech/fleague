import React, { useState } from 'react';
import './Message.css';
import DirectMessage from './DirectMessage';
import LeagueChat from './LeagueChat';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';

const Message = () => {
  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="message-container content">
      <div className="centered-tab-buttons"> {/* Added class */}
        <Tabs
          textColor="black"
          value={activeTab}
          onChange={handleTabChange}
          aria-label="icon label tabs example"
          sx={{
            '& .MuiTab-textColorInherit.Mui-selected': {
              color: '#142e60',
              '&:hover': {
                color: '#4caf50',
              },
            },
            '& .MuiTab-root': {
              color: 'black',
              fontFamily: 'Roboto Slab, serif',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4caf50',
            },
          }}
        >
          <Tab icon={<ForumIcon />} label="Direct Message" />
          <Tab icon={<ChatIcon />} label="League Chat" />
        </Tabs>
      </div>
      <div className="tab-content">
        {activeTab === 0 && <DirectMessage />}
        {activeTab === 1 && <LeagueChat />}
      </div>
    </div>
  );
};

export default Message;