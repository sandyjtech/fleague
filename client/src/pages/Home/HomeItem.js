import React from 'react';
import './Home.css'; 

const HomeItem = ({ displayName, description, value, abbreviation, rankDisplayValue }) => {
  return (
    <div className="stat-card">
      <h2>{displayName}</h2>
      <p>{description}</p>
      <div className="stat-details">
        <div className="stat-item">
          <span>Value:</span>
          <span>{value}</span>
        </div>
        <div className="stat-item">
          <span>Abbreviation:</span>
          <span>{abbreviation}</span>
        </div>
        <div className="stat-item">
          <span>Rank:</span>
          <span>{rankDisplayValue}</span>
        </div>
      </div>
    </div>
  );
};

export default HomeItem;