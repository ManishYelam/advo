import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."  // <-- wrap in quotes
        className="h-5 px-2 border border-gray-300 text-[10px] focus:outline-none"
        style={{
          width: '200px',
          borderRadius: '3px 0 0 3px',
        }}
      />

      <button
        type="submit"
        className="h-5 w-8 bg-green-600 text-gray-700 border border-gray-300 flex items-center justify-center text-xs focus:outline-none"
        title="Search"
        style={{
          borderRadius: '0 3px 3px 0',
          boxShadow: hovered
            ? `
        inset 2px 2px 4px rgba(0, 0, 0, 0.4),
        inset -2px -2px 4px rgba(255, 255, 255, 0.5),
        inset 0 2px 4px rgba(0, 0, 0, 0.3),
        inset 0 -2px 4px rgba(255, 255, 255, 0.3)
      `
            : `
        inset 1px 1px 2px rgba(0, 0, 0, 0.3),
        inset -1px -1px 2px rgba(255, 255, 255, 0.4),
        inset 0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0 -1px 2px rgba(255, 255, 255, 0.2)
      `,
          transition: 'box-shadow 0.3s ease-in-out',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FaSearch size={10} />
      </button>

    </form>
  );
};

export default SearchBar;
