import React, { useEffect, useState } from "react";
import "./Home.css";
import HomeItem from "./HomeItem";
import SearchBar from "../../components/SearchBar";

const Home = () => {
  const [lastYearStats, setLastYearStats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const previousYear = new Date().getFullYear() - 1;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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

  const renderStatCategory = (categoryIndex) => {
    const stats = lastYearStats[categoryIndex].stats;
    const categoryTitle = lastYearStats[categoryIndex].displayName;

    // Filter the stats based on the searchQuery
    const filteredStats = stats.filter((stat) => {
      const query = searchQuery.toLowerCase();
      const description = stat.description.toLowerCase();
      return query === "" || description.includes(query);
    });

    return (
      <div key={categoryTitle}>
        <h1 className="title">{categoryTitle}</h1>
        <div className="stat-card-container">
          {filteredStats.map((stat) => (
            <HomeItem key={stat.name} {...stat} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <h1>Stats</h1>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          lastYearStats.map((_, index) => renderStatCategory(index))
        )}
      </div>
    </>
  );
};

export default Home;
