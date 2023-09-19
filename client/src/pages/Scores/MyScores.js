import React, { useState, useEffect } from 'react';
import './Scores.css';
import { useUserAuth } from '../../context/UserAuthProvider';
import Avatar from '@mui/material/Avatar';

const MyScores = () => {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState("");
  const [week, setWeek] = useState(2); 
  const { user } = useUserAuth(); 
  const [error, setError] = useState(null);
  const [showCreateTeamMessage, setShowCreateTeamMessage] = useState(false);

  useEffect(() => {
    fetch(`/api/player_by_userid/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.team_name) {
          setTeam(data.team_name);
          setPlayers(data.players);
        } else {
          setShowCreateTeamMessage(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching fantasy players:', error);
        setError('Error fetching fantasy players');
      });
  }, [user.id]);

  return (
    <div className="my-scores-container">
      <h1>Fantasy League Team</h1>
      {showCreateTeamMessage ? (
        <div className="message-card">
          <p>Please go to My Account and create a team.</p>
        </div>
      ) : (
        <>
          {players.length === 0 ? (
            <div className="message-card">
              <p>No players found. Please go to Account and create Team.</p>
            </div>
          ) : (
            <>
              <p>Connect your sleeper matchup scores</p>          
              <div className="scores-table">
                <div className="team-column">
                  <h2 style={{color: 'whitesmoke'}}>{team}</h2>
                  <h3 style={{color:  '#4caf50', marginTop: '15px'}}>Starters</h3>
                  <ul>
                    {players
                      .filter((player) => !player.is_benched)
                      .map((player) => (
                        <li key={player.id}>
                          <div className="player-avatar">
                            {/* Add player avatar here */}
                          </div>
                          {player.team_name} - 
                        </li>
                      ))}
                  </ul>
                  <h3 style={{color: 'black', marginTop: '15px'}}>Benched</h3>
                  <ul>
                    {players
                      .filter((player) => player.is_benched)
                      .map((player) => (
                        <li key={player.id}>
                          <Avatar src={player.avatar_url} alt={player.player_name} />
                          {player.team_name} - Benched
                        </li>
                      ))}
                  </ul>
                </div>
                <h2 style={{color: ' #ccc'}}>vs</h2>
                <div className="opponent-column">
                  <h2 style={{color: 'whitesmoke'}}>Opponent</h2>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyScores;
