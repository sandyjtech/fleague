import React, {useState} from 'react';
import './Account.css';
import MyProfile from "./MyProfile";
import LeagueManagement from "./LeagueManagement"

const Account = () => {
 // State to manage which tab is active
 const [activeTab, setActiveTab] = useState('League Management');

 // Function to handle tab click
 const handleTabClick = (tab) => {
   setActiveTab(tab);
 };

  return (
    <div className="message-container">
      <div className="tab-buttons">
        <button
          className={activeTab === 'League Management' ? 'active-tab' : ''}
          onClick={() => handleTabClick('League Management')}
        >
          League Management
        </button>
        <button
          className={activeTab === 'My Profile' ? 'active-tab' : ''}
          onClick={() => handleTabClick('My Profile')}
        >
          My Profile
        </button>
      </div>
      <div className="tab-content">
        {/* Conditional rendering of components */}
        {activeTab === 'League Management' && <LeagueManagement />}
        {activeTab === 'My Profile' && <MyProfile/>}
      </div>
    </div>
  );
};
 export default Account;