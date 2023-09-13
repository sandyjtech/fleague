import React, { useState, useEffect } from 'react';
import './Scores.css';
import { useUserAuth } from "../../context/UserAuthProvider";

const MyScores = () => {  

  const [players, setPlayers] = useState([]);
  const [playerScores, setPlayerScores] = useState({});
  const { user } = useUserAuth(); 
 

  useEffect(() => {
    // Fetch the list of fantasy players for the user
    fetch(`/api/player_by_userid/${user.id}`) // Replace USER_ID with the actual user ID
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.error('Error fetching fantasy players:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch player scores for each player
    players.forEach((player) => {
      fetch(`/api/player_performances/${player.id}`)
        .then((response) => response.json())
        .then((data) => {
          // Store scores in a dictionary with player ID as the key
          setPlayerScores((prevState) => ({
            ...prevState,
            [player.id]: data,
          }));
        })
        .catch((error) => {
          console.error('Error fetching player scores:', error);
        });
    });
  }, [players]);

  return (
    <div>
      <h1>Fantasy League Team</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.first_name} -{' '}
            {playerScores[player.id] ? (
              playerScores[player.id].map((score) => (
                <span key={score.id}>Score: {score.score}</span>
              ))
            ) : (
              <span>No scores available</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default MyScores;