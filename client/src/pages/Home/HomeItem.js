import React from 'react';
import './Home.css';

const HomeItem = ({ displayName, description, value, abbreviation, rankDisplayValue }) => {
  return (
    <div className="stat-card">
      <h2 className="title">{displayName}</h2>
      <div className="stat-details">
        <div className="stat-item">
          <p className="description">{description}:<span className="value">{value}</span></p>
          
        </div>
        <div className="stat-item">
          <span className="label">Abbreviation: </span>
          <span className="abbreviation">{abbreviation}</span>
        </div>
        <div className="stat-item">
          <span className="label">Rank: </span>
          <span className="rank">{rankDisplayValue}</span>
        </div>
      </div>
    </div>
  );
};

export default HomeItem;