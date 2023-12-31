import React, { useState } from 'react';
import './Scores.css';
import AllScores from './AllScores';
import MyScores from './MyScores';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SportsIcon from '@mui/icons-material/Sports';
import StarIcon from '@mui/icons-material/Star';
//https://api.sleeper.com/stats/nfl/player/${playerID}?season_type=regular&season=${currentYear}&grouping=week
const Scores = () => {   
  const [activeTab, setActiveTab] = useState(0);
  const [players, setPlayers] = useState([])
const [playerPoints, setPlayerPoints] = useState([])

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
 
  return (
    <div className="scores-container content">
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
          <Tab icon={<SportsIcon />} label="All Scores" />
          <Tab icon={<StarIcon />} label="My Scores" />
        </Tabs>
      </div>
      <div className="tab-content">
        {activeTab === 0 && <AllScores />}
        {activeTab === 1 && <MyScores />}
      </div>
    </div>
  );
};

export default Scores;