import React, { useEffect, useState } from "react";
import "./Account.css"; // Import your CSS file
import PlayerModal from "./PlayerModal";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
const LeagueManagement = ({ user }) => {
  const [players, setPlayers] = useState([]); // All players from the API
  const [filteredPlayers, setFilteredPlayers] = useState([]); // Filtered list based on search query
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPositions, setSelectedPositions] = useState([]);
  const maxPlayers = 500; // Maximum players to display
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isSlectedOpen, setSlectedOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const positionDefinitions = {
    LB: "Linebacker",
    DB: "Defensive Back",
    CB: "Cornerback",
    C: "Center",
    CD: "Card",
    RB: "Running Back",
    QB: "Quarterback",
    FB: "Fullback",
    DL: "Defensive Lineman",
    DT: "Defensive Tackle",
    DE: "Defensive End",
    TE: "Tight End",
    FS: "Free Safety",
    G: "Guard",
    OG: "Offensive Guard",
    ILB: "Inside Linebacker",
    K: "Kicker",
    LS: "Long Snapper",
    OL: "Offensive Lineman",
    NT: "Nose Tackle",
    P: "Punter",
    WR: "Wide Receiver",
    SS: "Strong Safety",
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    // Fetch all players from the API initially
    fetch("/api/players")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((playersData) => {
        setPlayers(playersData);
        // Initially, display the first 100 players
        setFilteredPlayers(
          playersData.slice((page - 1) * pageSize, page * pageSize)
        );
        setSelectedPositions(Object.keys(positionDefinitions));
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);
  // console.log(filteredPlayers);
  // Function to open the modal
  const openModal = (player) => {
    console.log("Opening modal for player:", player); // Debugging
    setSelectedPlayer(player);
    setSlectedOpen(true);
  };
  // Function to close the modal
  const closeModal = () => {
    setSelectedPlayer(null);
    setSlectedOpen(false);
  };
  // Function to handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter players based on the search query
    const filtered = players.filter(
      (player) =>
        (player.first_name &&
          player.first_name.toLowerCase().includes(query.toLowerCase())) ||
        (player.last_name &&
          player.last_name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredPlayers(filtered.slice(0, maxPlayers));
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (position) => {
    // Toggle the selected position
    if (selectedPositions.includes(position)) {
      setSelectedPositions(selectedPositions.filter((pos) => pos !== position));
    } else {
      setSelectedPositions([...selectedPositions, position]);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div>
        <h2 className="title">Select Positions to Display:</h2>
        <div className="position-checkboxes">
          {Object.keys(positionDefinitions).map((position) => (
            <label key={position}>
              <input
                type="checkbox"
                value={position}
                checked={selectedPositions.includes(position)}
                onChange={() => handleCheckboxChange(position)}
              />
              {positionDefinitions[position]}
            </label>
          ))}
        </div>
        {selectedPositions.map((selectedPosition) => (
  <div key={selectedPosition}>
            <h2 className="title">{positionDefinitions[selectedPosition]}</h2>
            <div className="scrollable-row">
              {filteredPlayers
                .filter((player) => selectedPositions.includes(player.position))
                .map((player) => (
                  <div
                    key={player.id}
                    className="player-card"
                    onClick={() => openModal(player)} // Open modal on click
                  >
                    {/* Render player information here */}
                    <p>{player.first_name}</p>
                    <p>
                      {player.last_name} ({player.number})
                    </p>

                    <p>{player.team}</p>
                    <p
                      className={
                        player.injury_status === "Active" ? "blue" : "red"
                      }
                    >
                      {player.injury_status}
                    </p>
                    <p className="position">{player.position}</p>
                    {/* Add more player info as needed */}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {/* Display modal if a player is selected and isSlectedOpen is true */}
      {selectedPlayer && (
        <Dialog open={isSlectedOpen} onClose={closeModal}>
        <DialogContent>
        <PlayerModal player={selectedPlayer} onClose={closeModal} />
        </DialogContent>
      </Dialog>
      )}
      <div className="pagination">
      <button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      <button
        disabled={page * pageSize >= filteredPlayers.length}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </div> 
    </>
  );
};

export default LeagueManagement;
