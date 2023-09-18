import React, { useState, useEffect } from "react";
import "./News.css";
import NewsSection from "./NewsSections";
import SearchBar from "../../components/SearchBar";
import { useUserAuth } from "../../context/UserAuthProvider";

const News = () => {
  const [allNews, setAllNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    fetch(
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=100"
    )
      .then((response) => response.json())
      .then((data) => {
        setAllNews(data.articles);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/player_by_userid/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.team_name) {
          setPlayers(data.players);
        }
      })
      .catch((error) => {
        console.error("Error fetching fantasy players:", error);
      });
  }, [user.id]);

  const filteredNews = allNews.filter((item) => {
    const query = searchQuery.toLowerCase();
    const headline = item.headline.toLowerCase();
    return query === "" || headline.includes(query);
  });

  const filteredNewsByPlayer = allNews.filter((item) => {
    return players.some(
      (player) =>
        item.headline.toLowerCase().includes(player.first_name.toLowerCase()) ||
        item.headline.toLowerCase().includes(player.last_name.toLowerCase())        
    );
  });

  // Check if player-specific news is available
  const isPlayerNewsAvailable = filteredNewsByPlayer.length > 0;

  console.log(isPlayerNewsAvailable ? "Player news is available" : "No player news available");

  return (
    <div className="news-container">
      <h1 style={{marginBottom: '5%', fontSize: '200%'}}>News</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div>
        <h1 className="title">My Teams News</h1>
        <NewsSection article={filteredNewsByPlayer} />
      </div>

      <div>
        <h1 className="title">All News</h1>
        <NewsSection article={filteredNews} />
      </div>
    </div>
  );
};

export default News;