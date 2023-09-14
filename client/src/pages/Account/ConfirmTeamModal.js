import React, {useState,} from "react";

const ConfirmTeamModal = ({ players, onClose, user }) => {
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
    // Prepare the data for the team (team name and user_id)
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
      updatedPlayers[playerIndex].isBenched = !updatedPlayers[playerIndex].isBenched;

      // Update the state with the modified array
      setFantasyPlayers(updatedPlayers);
    }
  };

//console.log(players)
  

return (
    <div className="modal">
      <h2>Add Team Name Here:</h2>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <div className="player-grid">
        {fantasyPlayers.map((player) => (
          <div key={player.nfl_player_id} className="player-card">
            <h3>{player.first_name}</h3>
            <label>
              <input
                type="checkbox"
                checked={player.isBenched}
                onChange={() => handleBenchedToggle(player.id)}
              />
              Benched
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleClose}>Close</button>
      <button onClick={handleConfirm}>Confirm Team</button>
    </div>
  );
};

export default ConfirmTeamModal;