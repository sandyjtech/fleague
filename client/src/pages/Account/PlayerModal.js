import React from "react";
import Avatar from "@mui/material/Avatar";
import "./PlayerModal.css"; // Import the CSS file for styling

const PlayerModal = ({ player, onClose }) => {
  const handleClose = () => {
    console.log("Close button clicked");
    onClose();
  };

  if (!player) {
    return null;
  }
  const activeColor = player.injury_status === "Active" ? "#4caf50" : "red";
  return (
    <div className="modal">
      <div className="modal-content athlete-card">
        <div className="athlete-image-container">
          {/* <img
            src={player.first_name}
            alt={player.image}
            loading="lazy"
            className="athlete-image"
          /> */}
        </div>
        <div className="athlete-info-container">
          <Avatar
            alt={`${player.first_name} ${player.last_name}`}
            src={`${player.first_name} ${player.last_name}`}
            sx={{ width: 24, height: 24 }}
            className="athlete-avatar"
          />{" "}
          <h2 className="athlete-name">{`${player.first_name} ${player.last_name}`}</h2>
          <p className="athlete-info">Age: {player.age}</p>
          <p className="athlete-info">College: {player.college}</p>
          <p className="athlete-info">ESPN ID: {player.espn_id}</p>
          <p className="athlete-info">
            Fantasy Data ID: {player.fantasy_data_id}
          </p>
          <p className="athlete-info">Number: {player.number}</p>
          <p className="athlete-info">Team: {player.team}</p>
          <p className="athlete-info">Injury Status: 
          <span style={{color: activeColor}}> {player.injury_status}</span></p>
          <p className="athlete-info">Position: {player.position}</p>
        </div>
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PlayerModal;
