// src/components/SearchBar.jsx
import { useState } from "react";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-3 py-1.5 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
