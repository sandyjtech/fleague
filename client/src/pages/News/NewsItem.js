import React from "react";
import "./News.css"; 

const NewsItem = ({ article }) => {
  const imageUrl = article.images.length > 0 ? article.images[0].url : "";
  
  // Check if description is defined before using toLowerCase
  const description = article.description ? article.description.toLowerCase() : "";

  return (
    <div className="news-item">
      <h1>{article.headline}</h1>
      {imageUrl && <img src={imageUrl} alt={article.headline} />}
      {/* Use description only if it's defined */}
      {description && <p>{description}</p>}
    </div>
  );
};

export default NewsItem;