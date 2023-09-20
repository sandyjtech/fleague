import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Account.css";

const ConfirmTeamModal = ({ players, onClose, user, setIsTeamModalOpen }) => {
  const [teamName, setTeamName] = useState(""); 

  const [fantasyPlayers, setFantasyPlayers] = useState(
    players.map((player) => ({
      ...player,
      isBenched: false,
    }))
  );

  const handleClose = () => {
    console.log("Close button clicked");
    onClose();
  };

  const handleConfirm = () => {
    const teamData = {
      name: teamName,
      user_id: user.id,
    };

    // Send a POST request to create the team
    console.log("Request URL:", "/api/fantasy_teams");
    fetch("/api/fantasy_teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamData),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          response.json().then((data) => {
            console.error("Response body:", data);
          });
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((team) => {
        // Handle the response from the backend if needed
        console.log("Team created:", team);

        // Send individual POST requests for each player
        fantasyPlayers.forEach((player) => {
          const playerData = {
            fantasy_team_id: team.id,
            is_benched: player.isBenched,
            nfl_player_id: player.id.toString(),
          };

          // Send a POST request to create the player
          fetch("/api/fantasy_players", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(playerData),
          })
            .then((response) => {
              if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                response.json().then((data) => {
                  console.error("Response body:", data);
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((createdPlayer) => {
              console.log("Player created:", createdPlayer);
              setIsTeamModalOpen(false)
            })
            .catch((error) => {
              console.error("Error creating player:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error creating team:", error);
      });
  };

  const handleBenchedToggle = (playerId) => {
    // Create a copy of the players array
    const updatedPlayers = [...fantasyPlayers];
    const playerIndex = updatedPlayers.findIndex(
      (player) => player.id === playerId
    );
    if (playerIndex !== -1) {
      updatedPlayers[playerIndex].isBenched =
        !updatedPlayers[playerIndex].isBenched;
      setFantasyPlayers(updatedPlayers);
    }
  };

  //console.log(players)

  return (
    <div className="modal">
      <div className="team-card">
        <h2>Create Your Team</h2>
        <TextField
          fullWidth
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
        />

        <div className="player-grid">
          <List>
            {fantasyPlayers.map((player) => (
              <ListItem key={player.nfl_player_id} className="player-card">
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      color: "#142e60",
                      fontWeight: "bold",
                      fontFamily: "Roboto Slab",
                    },
                  }}
                  primary={`${player.first_name} ${player.last_name} (${player.position})`}
                />{" "}
                Benched?
                <Checkbox
                  checked={player.isBenched}
                  onChange={() => handleBenchedToggle(player.id)}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="button-container">
          <Button
            variant="outlined"
            style={{ color: "red", fontFamily: "Roboto Slab" }}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="contained"
            style={{ background: "#142e60", fontFamily: "Roboto Slab" }}
            onClick={handleConfirm}
          >
            Confirm Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTeamModal;
