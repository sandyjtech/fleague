import React from "react";

const PlayerModal = ({ player, onClose }) => {
  const handleClose = () => {
    console.log("Close button clicked"); // Debugging
    onClose();
  };
  const {
    age,
    college,
    espn_id,
    fantasy_data_id,
    first_name,
    last_name,
    number,
    team,
    injury_status,
    position,
  } = player;
  return (
    <div className="modal">
      <div className="modal-content">
        {/* Display player details here */}
        <h2>{`${first_name} ${last_name}`}</h2>
        <p>Age: {age}</p>
        <p>College: {college}</p>
        <p>ESPN ID: {espn_id}</p>
        <p>Fantasy Data ID: {fantasy_data_id}</p>
        <p>Number: {number}</p>
        <p>Team: {team}</p>
        <p>Injury Status: {injury_status}</p>
        <p>Position: {position}</p>
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
