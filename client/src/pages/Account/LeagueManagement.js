import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Account.css"; // Import your CSS file
import PlayerModal from "./PlayerModal";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const LeagueManagement = ({ user }) => {
  const [players, setPlayers] = useState([]); // All players from the API
  const [filteredPlayers, setFilteredPlayers] = useState([]); // Filtered list based on search query
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [positionFilteredPlayers, setPositionFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const maxPlayers = 500; // Maximum players to display
  const [isSlectedOpen, setSlectedOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;
   const [fantasyTeam, setFantasyTeam] = useState([]);
  const [playerInQueue, setPlayerInQueue] = useState([]);
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
        //setSelectedPositions(Object.keys(positionDefinitions));
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

  const handleCheckboxChange = (position) => {
    // Toggle the selected position
    if (selectedPositions.includes(position)) {
      setSelectedPositions(selectedPositions.filter((pos) => pos !== position));
      // Remove the filtered players for this position
      setPositionFilteredPlayers((prevState) => {
        const newState = { ...prevState };
        delete newState[position];
        return newState;
      });
    } else {
      setSelectedPositions([...selectedPositions, position]);
      // Filter and set the players for this position
      setPositionFilteredPlayers((prevState) => ({
        ...prevState,
        [position]: filteredPlayers.filter(
          (player) => player.position === position
        ),
      }));
    }
  };
  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(players);
    const [reorderedItem] = items.splice(result.source.droppableId, 1);
    items.splice(result.destination.droppableId, items.length, reorderedItem);

    setPlayerInQueue(items);
    console.log(items)
    console.log(reorderedItem)
  }

  return (
    <>
      {/******** Added DND ***************/}
      <DragDropContext onDragEnd={handleDragEnd}>
        <input
          type="text"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Droppable droppableId="filteredPlayers">
          {(provided) => (
            <div
              className="droppable"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div>
                <h2 className="title">Select Positions to Display:</h2>
                <div className="position-checkboxes">
                  {Object.keys(positionDefinitions).map((position) => (
                    <label key={position}>
                      <input
                        type="checkbox"
                        value={position}
                        checked={selectedPositions.includes(position)}
                        onChange={() => handleCheckboxChange(position, "queue")}
                      />
                      {positionDefinitions[position]}
                    </label>
                  ))}
                </div>
                <Droppable droppableId="inQueue">
                  {(provided) => (
                    <div
                      className="in-queue"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <h3>In Queue</h3>
                      {playerInQueue.map((player, index) => (
                        <Draggable
                          key={player.id} // Make sure player.id is unique
                          draggableId={`player-${player.id}-${index}`} // Create a unique identifier
                          index={index}
                        >
                          {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="player-card"
                                onClick={() => openModal(player)}
                              >
                                <p>{player.first_name}</p>
                                <p>
                                  {player.last_name} ({player.number})
                                </p>

                                <p>{player.team}</p>
                                <p
                                  className={
                                    player.injury_status === "Active"
                                      ? "blue"
                                      : "red"
                                  }
                                >
                                  {player.injury_status}
                                </p>
                                <p className="position">{player.position}</p>
                              </div>
                            )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="fantasyTeam">
                  {(provided) => (
                    <div
                      className="fantasy-team"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <h3>Fantasy Team</h3>
                      {fantasyTeam.map((player, index) => (
                        <Draggable
                          key={player.id}
                          draggableId={player.id}
                          index={index} // Use a separate index for this Droppable
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="player-card"
                              onClick={() => openModal(player)}
                            >
                              {/* Render player information here */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {selectedPositions.map((selectedPosition) => (
                  <div key={selectedPosition}>
                    <h2 className="title">
                      {positionDefinitions[selectedPosition]}
                    </h2>
                    <div className="scrollable-row">
                      {positionFilteredPlayers[selectedPosition].map(
                        (player, index) => (
                          <Draggable
                            key={player.id}
                            draggableId={player.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="player-card"
                                onClick={() => openModal(player)}
                              >
                                <p>{player.first_name}</p>
                                <p>
                                  {player.last_name} ({player.number})
                                </p>

                                <p>{player.team}</p>
                                <p
                                  className={
                                    player.injury_status === "Active"
                                      ? "blue"
                                      : "red"
                                  }
                                >
                                  {player.injury_status}
                                </p>
                                <p className="position">{player.position}</p>
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Droppable>

        {selectedPlayer && (
          <Dialog open={isSlectedOpen} onClose={closeModal}>
            <DialogContent>
              <PlayerModal player={selectedPlayer} onClose={closeModal} />
            </DialogContent>
          </Dialog>
        )}
      </DragDropContext>
    </>
  );
};

export default LeagueManagement;
