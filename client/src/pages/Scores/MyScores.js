import React, { useState, useEffect } from 'react';
import './Scores.css';
import { useUserAuth } from '../../context/UserAuthProvider';
import Avatar from '@mui/material/Avatar';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Leaderboard from './LeaderBoard';

const MyScores = () => {
  const [players, setPlayers] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1); // Default to week 1
  const { user } = useUserAuth();
  const [showCreateTeamMessage, setShowCreateTeamMessage] = useState(false);

  useEffect(() => {
    fetch(`/api/performance_by_user/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          setShowCreateTeamMessage(true);
          return []; // Return an empty array if there's an error to prevent the "players.map" error.
        }
        return response.json();
      })      
      .then((data) => setPlayers(data))
  }, [user.id]);

  const uniqueWeeks = [
    ...new Set(players.map((performance) => performance.week_num)),
  ];
//console.log(players)
  // Filter players based on the selected week and is_benched
  const filteredPlayers = players.filter((player) => player.week_num === selectedWeek);
  const filteredStarters = filteredPlayers.filter((player) => !player.is_benched);
  const filteredBenched = filteredPlayers.filter((player) => player.is_benched);

  return (
    <div className="my-scores-container">
      <div>
      <h1>Fantasy League Team</h1>
      <div className="horizontal-timeline">
        <Timeline
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#333',
            borderRadius: '5px',
          }}
        >
          {uniqueWeeks.map((week) => (
            <TimelineItem
              key={week}
              onClick={() => setSelectedWeek(week)}
              style={{
                backgroundColor: '#333',
                border: 'none',
                color: 'whitesmoke',
              }}
            >
              <TimelineDot color={week === selectedWeek ? 'success' : 'primary'} />
              <TimelineContent
                style={{
                  fontFamily: 'Roboto Slab',
                  fontSize: week === selectedWeek ? '24px' : 'large',
                  justifyContent: 'space-between',
                }}
              >
                Week:{week}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      {showCreateTeamMessage ? (
      <div className="message-card">
        <p>Please go to My Account and create a team.</p>
      </div>
    ) : (
        <>
           {players.length === 0 ? (
          <div className="message-card">
              <p>No players found for Week {selectedWeek}. Please go to Account and create Team.</p>
            </div>
          ) : (
            <>
            <div style={{display: 'flex'}}>
              <h2 style={{color: '#4caf50'}}>{players[0].team_name}  </h2>
              <p style={{margin: '0 auto'}}>Week: {selectedWeek}</p></div>
              
            <div className="scores-table"style={{background: 'whitesmoke', borderRadius: '10px', width:'100%'}}>
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Position</th>
                    <th>Standard Points</th>
                    <th>PPR Points</th>
                  </tr>
                </thead>
                <tbody style={{background: '#ccc', color: 'black'}}>
                  {filteredStarters.map((player) => (
                    <tr key={player.id}>
                      <td>
                        <div className="player-avatar">
                          <Avatar src={player.avatar_url} alt={player.player_name} style={{background: '#4caf50'}}/>
                        </div>
                        <p style={{color: 'black'}}>{player.first_name} - {player.last_name}</p>
                      </td>
                      <td>{player.team}</td>
                      <td>{player.position}</td>
                      <td>{player.standard_points}</td>
                      <td>{player.ppr_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table><div>
              <h3 style={{ color: 'black', marginTop: '-15%' }}>Benched</h3>
              <table >
                <thead>
                  <tr>
                    <th>Player</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBenched.map((player) => (
                    <tr key={player.id}>
                      <td>
                        <div className="player-avatar">
                          <Avatar src={player.avatar_url} alt={player.player_name} style={{background: '#142e60'}}/>
                        </div>
                        <p>{player.first_name} - {player.last_name} (Benched)</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>                      
              <Leaderboard user={user} selectedWeek={selectedWeek} />            

            </>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default MyScores;
