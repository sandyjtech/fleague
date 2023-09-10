import React, { useState, useEffect } from "react";
import "./News.css";
import NewsSection from "./NewsSections";
import SearchBar from "../../components/SearchBar";

const News = () => {
  const [allNews, setAllNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=50"
    )
      .then((response) => response.json())
      .then((data) => {
        setAllNews(data.articles);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, []);

  const rows = ["My Leagues News", "Todays News", "All News"];

  const filteredNews = allNews.filter((item) => {
    const query = searchQuery.toLowerCase();
    const headline = item.headline.toLowerCase();
    return query === "" || headline.includes(query);
  });

  return (
    <div className="news-container">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {rows.map((rowTitle, index) => (
        <NewsSection
          key={index}
          title={rowTitle}
          article={filteredNews}
        />
      ))}
      {/* Modal for displaying article details */}
      {/* ... */}
    </div>
  );
};

export default News;