import React, { useState } from "react";

const Search = ({ fetchWeather }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔥 prevents page reload

    if (!city.trim()) return; // avoid empty input

    fetchWeather(city); // call function
    setCity(""); // clear input
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button type="submit">Search</button> {/* 🔥 important */}
    </form>
  );
};

export default Search;