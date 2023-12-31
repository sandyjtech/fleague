import React from "react";
import "./SearchBar.css"; // Create a separate CSS file for your styles

function SearchBar({ handleSearch, searchQuery, setSearchQuery }) {
  function handleSubmit(e) {
    e.preventDefault();
    handleSearch(searchQuery);
  }

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          id="search"
          placeholder="Search here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
      </div>
    </form>
  );
}

export default SearchBar;
