import React, { useEffect, useState } from "react";
import "./Scores.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

const AllScores = () => {
  const [playerPerformances, setPlayerPerformances] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);

  useEffect(() => {
    // Make an HTTP GET request to your Flask API endpoint
    fetch("/api/player_performances")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched data
        setPlayerPerformances(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to filter scores based on the selected week
  const filteredScores = playerPerformances.filter(
    (performance) => performance.week_num === selectedWeek
  );

  // Function to handle click event on timeline items
  const handleWeekClick = (week) => {
    setSelectedWeek(week);
  };

  const handleChangeView = () => {
    setExpanded(!expanded);
  };

  // Get unique weeks from playerPerformances
  const uniqueWeeks = [
    ...new Set(playerPerformances.map((performance) => performance.week_num)),
  ];

  // Get unique teams from playerPerformances
  const uniqueTeams = [
    ...new Set(playerPerformances.map((performance) => performance.team)),
  ];

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setShowClearButton(query.length > 0); // Show clear button when the input is not empty

    // Filter player performances based on the search query
    const filteredResults = playerPerformances.filter(
      (performance) =>
        performance.first_name.toLowerCase().includes(query) ||
        performance.last_name.toLowerCase().includes(query)
    );
    setPlayerPerformances(filteredResults);
  };

  // Function to clear the search input and re-render all scores
  const handleClearSearch = () => {
    setSearchQuery("");
    setShowClearButton(false);
    // Reset to display all player performances
    setSearchQuery("")
    setPlayerPerformances(playerPerformances);
  };

  return (
    <div>
      <h1>All Scores</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by first name or last name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {showClearButton && (
          <button onClick={handleClearSearch}>Clear</button>
        )}
      </div>
      <div className="horizontal-timeline">
        <Timeline
          sx={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#333",
            borderRadius: "5px",
          }}
        >
          {uniqueWeeks.map((week) => (
            <TimelineItem
              key={week}
              onClick={() => handleWeekClick(week)}
              style={{
                backgroundColor: "#333",
                border: "none",
                color: "whitesmoke",
              }}
            >
              <TimelineDot
                color={week === selectedWeek ? "success" : "primary"}
              />
              <TimelineContent
                style={{
                  fontFamily: "Roboto Slab",
                  fontSize: week === selectedWeek ? "24px" : "large",
                  justifyContent: "space-between",
                }}
              >
                Week:{week}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      {uniqueTeams.map((team) => (
        <div key={team}>
          <Accordion onChange={handleChangeView}>
            <AccordionSummary>
              <h2 className="title">{team}</h2>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {filteredScores
                  .filter((performance) => performance.team === team)
                  .map((performance) => (
                    <Grid item key={performance.id} xs={12} sm={6} md={4}>
                      <Card>
                        <CardContent>
                          <h2>{`${performance.first_name} ${performance.last_name}`}</h2>
                          <p>
                            <strong>Position:</strong> {performance.position}
                          </p>
                          <p>
                            <strong>Team:</strong> {performance.team}
                          </p>
                          <p>
                            <strong>Standard Points:</strong>{" "}
                            <span style={{ color: "#4caf50" }}>
                              {performance.standard_points}
                            </span>
                          </p>
                          <p>
                            <strong>PPR Points:</strong>{" "}
                            <span style={{ color: "#4caf50" }}>
                              {performance.ppr_points}
                            </span>
                          </p>
                          <p>
                            <strong>Week:</strong> {performance.week_num}
                          </p>
                          <p>
                            <strong>Date:</strong> {performance.match_id}
                          </p>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default AllScores;
