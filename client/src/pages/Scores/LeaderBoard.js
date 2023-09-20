import React, { useState, useEffect } from "react";
import MyScores from "./MyScores";
import './Leaderboard.css'; // Import your CSS file

const Leaderboard = (selectedWeek) => {
  const [leaderboardData, setLeaderboardData] = useState({});

  useEffect(() => {
    fetch("./api/leaderboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLeaderboardData(data); 
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
      });
  }, [selectedWeek]);

  const calculateTotalPPR = (userData) => {
    return userData.reduce((total, player) => total + player.ppr_points, 0);
  };
  
  const calculateTotalStandard = (userData) => {
    return userData.reduce((total, player) => total + player.standard_points, 0);
  };

  // Sort users by the sum of their total PPR and Standard points in descending order
  const sortedUsers = Object.keys(leaderboardData).sort((a, b) => {
    const totalPointsA = calculateTotalPPR(leaderboardData[a]) + calculateTotalStandard(leaderboardData[a]);
    const totalPointsB = calculateTotalPPR(leaderboardData[b]) + calculateTotalStandard(leaderboardData[b]);
    return totalPointsB - totalPointsA;
  });
console.log(leaderboardData)
  return (
    <div className="leaderboard-container">
      <h1 className="title">Leaderboard</h1>
      {sortedUsers.map((userKey, index) => (
        <div key={userKey} className={index === 0 ? "firstUser" : "otherUser"} style={{textAlign: 'left'}}>
          <h2>Username: <span style={{color: "#142e60"}}>{userKey}</span></h2>
          <p>Total PPR Points: <span style={{color: '#4caf50'}}>{calculateTotalPPR(leaderboardData[userKey])}</span></p>
          <p>Total Standard Points: <span style={{color: '#4caf50'}}>{calculateTotalStandard(leaderboardData[userKey])}</span></p>
          <p>Total Points: <span style={{color: '#4caf50'}}>{calculateTotalPPR(leaderboardData[userKey]) + calculateTotalStandard(leaderboardData[userKey])}</span></p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>PPR Points</th>
                <th>Standard Points</th>
                <th>Team</th>
                <th>Week Number</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData[userKey].map((matchData, index) => (
                <tr key={index}>
                  <td>
                    {matchData.first_name} 
                    {matchData.last_name}
                  </td>
                  <td>{matchData.position}</td>
                  <td>{matchData.ppr_points}</td>
                  <td>{matchData.standard_points}</td>
                  <td>{matchData.team}</td>
                  <td>{matchData.week_num}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
