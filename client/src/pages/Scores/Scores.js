import React, {useState} from 'react';
import './Scores.css';
import AllScores from './AllScores';
import MyScores from './MyScores'

const Scores = () => {  

  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState('My Scores');

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="message-container">
      <div className="tab-buttons">
        <button
          className={activeTab === 'All Scores' ? 'active-tab' : ''}
          onClick={() => handleTabClick('All Scores')}
        >
          All Scores
        </button>
        <button
          className={activeTab === 'My Scores' ? 'active-tab' : ''}
          onClick={() => handleTabClick('My Scores')}
        >
          My Scores
        </button>
      </div>
      <div className="tab-content">
        {/* Conditional rendering of components */}
        {activeTab === 'All Scores' && <AllScores />}
        {activeTab === 'My Scores' && <MyScores/>}
      </div>
    </div>
  );
};

export default Scores;