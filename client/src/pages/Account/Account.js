import React, { useState, useEffect } from 'react';
import './Account.css';
import MyProfile from './MyProfile';
import LeagueManagement from './LeagueManagement';
import { useUserAuth } from '../../context/UserAuthProvider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import GroupsIcon from '@mui/icons-material/Groups';

const Account = () => {
  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState(0); // Use index for activeTab
  const { user, setUser } = useUserAuth();
  const { id } = user;

  useEffect(() => {
    fetch(`/users/${id}`)
      .then((response) => response.json())
      .then((user) => setUser(user))
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [id, setUser]);

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="account-container content">
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
        <Tab icon={<GroupsIcon />} label="League Management" />
        <Tab icon={<PersonPinIcon />} label="My Profile" />
      </Tabs>
      <div className="tab-content">
        {activeTab === 0 && <LeagueManagement user={user} />}
        {activeTab === 1 && <MyProfile user={user} />}
      </div>
    </div>
  );
};

export default Account;
