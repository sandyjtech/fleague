import React from "react";

const PlayerModal = ({ player, onClose }) => {
  const handleClose = () => {
    console.log("Close button clicked"); // Debugging
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Display player details here */}
        <h2>
          {player.first_name} {player.last_name} ({player.number})
        </h2>
        <p>Team: {player.team}</p>
        <p>Position: {player.position}</p>
        <p>Status: {player.injury_status}</p>
        <img
          src={player.image_url} // Replace with the actual image source
          alt={player.first_name}
          loading="lazy" // Add this attribute
        />
        {/* You can add an image here */}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default PlayerModal;
