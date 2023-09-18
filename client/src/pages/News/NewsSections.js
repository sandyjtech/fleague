import React, { useState } from "react";
import "./News.css";
import NewsItem from "./NewsItem";

const NewsSection = ({ article, title }) => {



  // Check if there are no articles
  if (!article || article.length === 0) {
    return (
      <div style={{background: "#142e60"}}>
        <h1 style={{color: "whitesmoke", textAlign: "justify", padding: "10px"}}>Sorry, no news available at the moment</h1>
      </div>
    );
  }

  

  return (
    <div>
      <div className="news-row">
        {article.map((article) => (
          <div key={article.id} className="news-section">
            <NewsItem article={article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;