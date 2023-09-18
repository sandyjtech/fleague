import React, { useState, useEffect } from 'react';
import './Scores.css';
import { useUserAuth } from '../../context/UserAuthProvider';

const MyScores = () => {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState("");
  const [leagueId, setLeagueId] = useState('');
  const [week, setWeek] = useState(2); // Set the initial week here
  const { user } = useUserAuth();
  const [nflMatchups, setNflMatchups] = useState([]);
  const [error, setError] = useState(null); // State for handling errors
  const [showCreateTeamMessage, setShowCreateTeamMessage] = useState(false);

  // Function to fetch NFL week matchup data
  const fetchNFLWeekMatchups = (leagueId, week) => {
    if (leagueId && week) {
      fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`)
        .then((response) => response.json())
        .then((data) => {
          setNflMatchups(data);
        })
        .catch((error) => {
          console.error('Error fetching NFL week matchups:', error);
        });
    }
  };

  // Handle button click to fetch NFL week matchups
  const handleButtonClick = () => {
    if (team) {
      fetchNFLWeekMatchups(leagueId, week);
    } else {
      setShowCreateTeamMessage(true);
    }
  };

  // Fetch the list of fantasy players for the user
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

  // Function to display player name and points for a specific week
  const getPlayerInfo = (nflPlayerId, weekNum) => {
    const matchup = nflMatchups.find((match) => match.players_points[nflPlayerId] !== undefined);
    if (matchup) {
      const points = matchup.players_points[nflPlayerId];
      return `${points} for match in week ${weekNum}`;
    }
    return 'No data available for this week';
  };

  return (
    <div className="my-scores-container">
      <h1>Fantasy League Team</h1>
      {showCreateTeamMessage ? (
        <p>Please go to My Account and create a team.</p>
      ) : (
        <>
          {/* User input for Sleeper User ID, League ID, and NFL Week */}
          <p>Connect your sleeper matchup scores</p>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter Sleeper League ID"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter NFL Week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            />
            {/* Submit button */}
            <button onClick={handleButtonClick}>Submit</button>
          </div>
          <div className="scores-table">
            <div className="team-column">
              <h2>{team}</h2>
              <ul>
                {players.map((player) => (
                  <li key={player.id}>
                    {player.team_name} - {player.is_benched ? 'Benched' : 'Starter'} -{' '}
                    {player.nfl_player_id ? (
                      <div>
                        {player.first_name} - {getPlayerInfo(player.nfl_player_id, week)}
                      </div>
                    ) : (
                      <span>No NFL Player ID</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="opponent-column">
              <h2>Opponent</h2>
              {/* Render opponent information here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyScores;




