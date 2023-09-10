import React from "react";
import "./News.css"; 


const NewsItem = ({article}) => {
  const imageUrl = article.images.length > 0 ? article.images[0].url : '';

  return (
    <div className="news-item">
      <h1>{article.headline}</h1>
      {imageUrl && <img src={imageUrl} alt={article.headline} />}
      <p>{article.description}</p>
    </div>
  );
};

export default NewsItem;