import React, { useState } from "react";
import "./News.css"; 
import NewsItem from "./NewsItem"

const NewsSection = ({article, title}) => {
   
    const articlesPerPage = 5;
    const [scrollPosition, setScrollPosition] = useState(0);
  
    const visibleArticles = article.slice(
      scrollPosition,
      scrollPosition + articlesPerPage
    );
  
    return (
      <div>        
        <h1 className="title">{title}</h1>
        <div className="news-row">
          {visibleArticles.map((article) => (
            <div key={article.id} className="news-section">
              <NewsItem article={article}/>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default NewsSection;