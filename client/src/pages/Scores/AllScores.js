import React, { useEffect, useState } from 'react';
import './Scores.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

const AllScores = () => {
  const [playerPerformances, setPlayerPerformances] = useState([]);

  useEffect(() => {
    // Make an HTTP GET request to your Flask API endpoint
    fetch('/api/player_performances')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched data
        setPlayerPerformances(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>All Scores</h1>
      <Grid container spacing={2}>
        {playerPerformances.map((performance) => (
          <Grid item key={performance.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <h2>{`${performance.fantasy_player.nfl_player.first_name} ${performance.fantasy_player.nfl_player.last_name}`}</h2>
                <p><strong>Position:</strong> {performance.fantasy_player.nfl_player.position}</p>
                <p><strong>Team:</strong> {performance.fantasy_player.nfl_player.team}</p>
                <p><strong>Standard Points:</strong> {performance.standard_points}</p>
                <p><strong>PPR Points:</strong> {performance.ppr_points}</p>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AllScores;
