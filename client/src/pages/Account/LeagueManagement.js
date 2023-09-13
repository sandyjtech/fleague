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
  //State for creating of teams
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  

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
              content: `${player.first_name} ${player.last_name}`, // Modify this as needed
              playerData: player, // You can store the entire player data if needed
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
  // Function to open the modal
  const openModal = () => {
    const fantasyTeamItems = getFantasyTeamItems();
    setSelectedPlayers(fantasyTeamItems); 
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const initialColumns = {
    [uuid()]: { name: "All Players", items: [] },
    [uuid()]: { name: "In Queue", items: [] },
    [uuid()]: { name: "Fantasy Team", items: [] },
  };
  const [columns, setColumns] = useState(initialColumns);

  //console.log(filteredPlayers);
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
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
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightslategray",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
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
                                      backgroundColor: snapshot.isDragging
                                        ? "blue"
                                        : "pink",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {" "}
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
        {/* Button to open the create team modal */}
        <button variant="contained" color="primary" onClick={openModal}>
          {" "}
          Create Team{" "}
        </button>
        <Dialog open={isModalOpen} onClose={closeModal}>
          <DialogContent>
            {/* Pass the selected players and team name to the modal */}
            <ConfirmTeamModal
            user={user}
              players={selectedPlayers}              
              onClose={closeModal}         
            />
          </DialogContent>
        </Dialog>
      </DragDropContext>
    </div>
  );
};

export default LeagueManagement;
