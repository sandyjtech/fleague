import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Account.css"; // Import your CSS file
import PlayerModal from "./PlayerModal";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { v4 as uuid } from "uuid";
import ConfirmTeamModal from "./ConfirmTeamModal";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const LeagueManagement = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const pageSize = 20;
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false); // Separate state for player modal
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  //Fetch from backend
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

        // Update the "All Players" column items with fetched data
        setColumns({
          ...columns,
          [Object.keys(columns)[0]]: {
            ...columns[Object.keys(columns)[0]],
            items: playersData.map((player) => ({
              id: uuid(),
              content: (
                <div>
                  <div style={{}}>
                    {player.first_name} {player.last_name} ({player.position})
                  </div>
                  <div style={{ color: "lightblue" }}>Team: {player.team}</div>
                  <div
                    style={{
                      color: player.status === "active" ? "red" : "green",
                    }}
                  >
                    Status: {player.status}
                  </div>
                </div>
              ),
              playerData: player,
            })),
          },
        });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const getFantasyTeamItems = () => {
    const fantasyTeamColumn = columns[Object.keys(columns)[2]]; // Assuming Fantasy Team is the third column
    return fantasyTeamColumn.items.map((item) => item.playerData);
  };

  // Function to open the team modal
  const openTeamModal = () => {
    const fantasyTeamItems = getFantasyTeamItems();
    setSelectedPlayers(fantasyTeamItems);
    setIsTeamModalOpen(true);
  };

  // Function to close the team modal
  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
  };

  // Function to open the player modal
  const openPlayerModal = (player) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };

  // Function to close the player modal
  const closePlayerModal = () => {
    setSelectedPlayer(null);
    setIsPlayerModalOpen(false);
  };

  const initialColumns = {
    [uuid()]: { name: "All Players", items: [] },
    [uuid()]: { name: "In Queue", items: [] },
    [uuid()]: { name: "Fantasy Team", items: [] },
  };
  const [columns, setColumns] = useState(initialColumns);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      // Fetch players based on the search query
      fetch(`/api/players/search?query=${searchQuery}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((playersData) => {
          // Update the "All Players" column items with search results
          setColumns({
            ...columns,
            [Object.keys(columns)[0]]: {
              ...columns[Object.keys(columns)[0]],
              items: playersData.map((player) => ({
                id: uuid(),
                content: `${player.first_name} ${player.last_name}`,
                playerData: player,
              })),
            },
          });
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } else {
      // If there's no search query, what to display?
    }
  }, [searchQuery]);

  return (
    <>
      <h1>Create or edit your team</h1>
      <p>Simply drag your preferred players into Fantasy Team to Create.</p>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search any player..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2 style={{color: 'black'}}>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={id} key={id}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightslategray"
                              : "whitesmoke",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                            borderRadius:'5px',
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                                
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: " 0 0 8px 0",
                                        minHeight: "50px",
                                        borderRadius: '5px',
                                        backgroundColor: snapshot.isDragging
                                          ? "#4caf50"
                                          : "#142e60",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                      onClick={() => openPlayerModal(item.playerData)}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}

          {/* Team Modal */}
          <Dialog open={isTeamModalOpen} onClose={closeTeamModal}>
            <DialogContent>
              {/* Pass the selected players and team name to the modal */}
              <ConfirmTeamModal
                user={user}
                players={selectedPlayers}
                onClose={closeTeamModal}
              />
            </DialogContent>
          </Dialog>
        </DragDropContext>
      </div>

      {/* Button to open the create team modal */}
      <button className="create-button" variant="contained" color="primary" onClick={openTeamModal}>
        Create Team
      </button>

      {/* Player Modal */}
      <Dialog open={isPlayerModalOpen} onClose={closePlayerModal}>
        <DialogContent>
          {/* Pass the selected player to the modal */}
          <PlayerModal player={selectedPlayer} onClose={closePlayerModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeagueManagement;