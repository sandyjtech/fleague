import React, { useEffect, useState } from "react";
import "./Home.css";
import HomeItem from "./HomeItem";
import SearchBar from "../../components/SearchBar";
import Calendar from './Calender';

const Home = () => {
  const [lastYearStats, setLastYearStats] = useState([]);
  const [loading, setLoading] = useState(true); 
  const previousYear = new Date().getFullYear() - 1;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    // Fetch NFL statistics for the previous year
    fetch(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${previousYear}/types/2/teams/24/statistics`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((stats) => {
        setLastYearStats(stats.splits.categories);
        setLoading(false);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
 // Fetch NFL schedules
  useEffect(() => {
    fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((schedulesData) => {
        const formattedSchedules = schedulesData.events.map((event) => ({
          title: `${event.competitions[0].competitors[0].team.displayName} vs. ${event.competitions[0].competitors[1].team.displayName}`,
          date: event.date,
          time: event.date,
        }));
        setSchedules(formattedSchedules);
        //console.log(schedules);
      })
      .catch((error) => {
        console.error("Error fetching schedules:", error);
      });
  }, []); 

  useEffect(() => {
    if (selectedDate) {      
      const selectedDateStr = selectedDate.toISOString().split("T")[0];      
      const gameDetails = {
        title: "Team A vs. Team B",
        date: selectedDateStr,
        time: "Time",        
      };
      setGameDetails(gameDetails);
    }
  }, [selectedDate]);
  const handleSearch = (query) => {    
    setSearchQuery(query);
  };
  const renderStats = () => {
    return lastYearStats.map((_, index) => {
      const stats = lastYearStats[index].stats;
      const categoryTitle = lastYearStats[index].displayName;

      // Filter the stats based on the searchQuery
      const filteredStats = stats.filter((stat) => {
        const query = searchQuery.toLowerCase();
        const description = stat.description.toLowerCase();
        return query === "" || description.includes(query);
      });

      return (
        <div key={categoryTitle} className="content">
          <h1 className="title">{categoryTitle}</h1>
          <div className="stat-card-container">
            {filteredStats.map((stat) => (
              <HomeItem key={stat.name} {...stat} />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <>
    <h1 style={{margin: "20% auto 5% auto"}}>Schedules</h1>      
    <Calendar schedules={schedules}/>
    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch}/>
    <h1 style={{margin: "20% auto 5% auto"}}>Stats</h1>
    {renderStats()}
  </>
  );
};

export default Home;
