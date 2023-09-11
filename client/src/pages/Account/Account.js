import React, {useState, useEffect} from 'react';
import './Account.css';
import MyProfile from "./MyProfile";
import LeagueManagement from "./LeagueManagement"
import { useUserAuth } from "../../context/UserAuthProvider";

const Account = () => {
 // State to manage which tab is active
 const [activeTab, setActiveTab] = useState('League Management');
 const { user, setUser } = useUserAuth(); 
 const { id } = user;

 useEffect(() => {
   fetch(`/users/${id}`) // Use the 'id' from useParams
     .then(response => response.json())
     .then(user => setUser(user))
     .catch(error => {
       // Handle error, e.g., setUser(null) or show an error message
       console.error("Error fetching user:", error);
     });
 }, [id, setUser]);
 // Function to handle tab click
 const handleTabClick = (tab) => {
   setActiveTab(tab);
 };

  return (
    <div className="account-container">
      
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
        {activeTab === 'League Management' && <LeagueManagement user={user}/>}
        {activeTab === 'My Profile' && <MyProfile user={user}/>}
      </div>
      
    </div>
  );
};
 export default Account;