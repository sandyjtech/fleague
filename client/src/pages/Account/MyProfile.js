import React, { useState, useEffect } from "react";
import "./Account.css";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


const MyProfile = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("myAccount"); // Default selected menu

  useEffect(() => {
    fetch(`/api/fantasy_players_by_user_id/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {        
          setPlayers(data.players);
        
      })
      .catch((error) => {
        console.error("Error fetching fantasy players:", error);
      });
  }, [user.id]);

console.log(players)
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="account2-container">
      {/* Side Menu */}
      <div className="side-menu">
        <button
          className={`side-menu-button ${
            selectedMenu === "myAccount" ? "active" : ""
          }`}
          onClick={() => handleMenuClick("myAccount")}
        >
          My Account
        </button>
        <button
          className={`side-menu-button ${
            selectedMenu === "myTeam" ? "active" : ""
          }`}
          onClick={() => handleMenuClick("myTeam")}
        >
          My Team
        </button>
        <button
          className={`side-menu-button ${
            selectedMenu === "settings" ? "active" : ""
          }`}
          onClick={() => handleMenuClick("settings")}
        >
          Settings
        </button>
      </div>

      <div className="main-content">
  {user && (
    <div>
      {selectedMenu === "myAccount" && (
        <>
          <h1>My Profile</h1>
          <h3 className="label">Username: <p style={{color: ' #333', display:'inline-flex'}}> {user.username}</p></h3>
          <h3 className="label">Email: <p style={{color: ' #333', display:'inline-flex'}}> {user.email}</p></h3>
        </>
      )}
      {selectedMenu === "myTeam" && (
        <>
          {players.length === 0 ? (
            <p>Please head to League Management to create a team.</p>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {players.map((player, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                  <Card style={{ backgroundColor: '#142e60',  padding: '0.5px 2px' }}>
                    <CardContent className="card-content">
                      <Typography variant="h6" sx={{ color:'whitesmoke', fontFamily: "Roboto Slab, serif" ,'@media (max-width: 600px)': { variant: 'body1' } }}>
                        {player.nfl_player.first_name} {player.nfl_player.last_name}
                      </Typography>
                      <Typography variant="body2" component="div" className="team-info" style={{ fontFamily: "Roboto Slab, serif"}}>
                        Position: {player.nfl_player.position}
                      </Typography>
                      <Typography variant="body2" component="div" className="team-info" style={{ fontFamily: "Roboto Slab, serif"}}>
                        Team: {player.nfl_player.team}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Settings Panel */}
      {selectedMenu === "settings" && (
        <div id="settings-panel">
          <h1>User Settings</h1>
          {/* Details View */}
          <div className="account-field">
            <h3 className="label">Username:</h3>
            <input type="text" className="input" value={user.username} />
            <h3 className="label">Email:</h3>
            <input type="text" className="input" value={user.email} />
            <h3 className="label">Current Password:</h3>
            <input
              type="password"
              className="input"
              value={user.password}
              placeholder="Enter password to save"
            />
          </div>
          {/* Save Options */}
          <div id="save-options">
            <button className="save-option-button" id="cancel-button">
              Cancel
            </button>
            <button className="save-option-button" id="save-button">
             Save
            </button>
          </div>
        </div>
      )}
    </div>
  )}
</div>
    </div>
  );
};

export default MyProfile;
