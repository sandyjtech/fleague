import React, { useState, useEffect } from 'react';
import './Scores.css';
import { useUserAuth } from '../../context/UserAuthProvider';

const MyScores = () => {
  const [players, setPlayers] = useState([]);
  const [playerScores, setPlayerScores] = useState([]);
  const [leagueId, setLeagueId] = useState('');
  const [sleeperUserId, setSleeperUserId] = useState('');
  const [week, setWeek] = useState(2); // Set the initial week here
  const { user } = useUserAuth();

  // Function to fetch NFL week matchup data
  const fetchNFLWeekMatchups = (leagueId, week) => {
    if (leagueId && week) {
      fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`)
        .then((response) => response.json())
        .then((data) => {
          setPlayerScores(data);
        })
        .catch((error) => {
          console.error('Error fetching NFL week matchups:', error);
        });
    }
  };

  // Function to compare and return starting points
  const getStartingPoints = (nflPlayerId) => {
    // Loop through playerScores and find the matching player
    for (const matchup of playerScores) {
      if (matchup.players.includes(nflPlayerId)) {
        return matchup.points; // Return the starting points for the player
      }
    }
    return null; // Return null if no match is found
  };

  // Handle button click to fetch NFL week matchups
  const handleButtonClick = () => {
    fetchNFLWeekMatchups(leagueId, week);
  };

  // Fetch the list of fantasy players for the user
  useEffect(() => {
    fetch(`/api/player_by_userid/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching fantasy players:', error);
      });
  }, [user.id]);

  return (
    <div>
      <h1>Fantasy League Team</h1>
      {/* User input for Sleeper User ID, League ID, and NFL Week */}
      <p>Connect your sleeper matchup scores</p>
      <input
        type="text"
        placeholder="Enter Sleeper User ID"
        value={sleeperUserId}
        onChange={(e) => setSleeperUserId(e.target.value)}
      />
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
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.first_name} -{' '}
            {player.nfl_player_id ? (
              <div>
                Starting Points: {getStartingPoints(player.nfl_player_id)}
              </div>
            ) : (
              <span>No NFL Player ID</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyScores;


///957705887915802624
