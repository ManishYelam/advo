import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logoutService } from "../services/authService";
import SearchBar from "./SearchBar"; 

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userFullName = user.full_name || "John Doe";
  const userEmail = user.email || "user@example.com";
  const userImage = user.image || "https://i.pravatar.cc/40";

  const loyaltyLevel = user.loyalty || "bronze";

  const gradientColors = {
    bronze: "from-[#cd7f32] to-[#ffa500]",
    silver: "from-gray-400 to-gray-600",
    gold: "from-yellow-400 to-yellow-600",
  };

  const navbarGradient = gradientColors[loyaltyLevel] || gradientColors.bronze;

  const handleLogout = async () => {
    await logoutService();
    window.location.href = "/login";
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`bg-gradient-to-r ${navbarGradient} text-white shadow-md px-6 py-4 flex justify-between items-center relative`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        {/* You can adjust width and height */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 50"
          className="w-40 h-10"
        >
          <text
            x="0"
            y="35"
            fill="white"
            fontSize="27"
            fontWeight="bold"
            fontFamily="serif"
          >
            Satyamev Jayate
          </text>
          <line
            x1="0"
            y1="42"
            x2="200"
            y2="42"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </Link>

      {/* Center search bar */}
      <div className="flex-1 mx-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <ul className="flex space-x-6">
        <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
        <li><Link to="/cases" className="hover:text-gray-200">Cases</Link></li>
        <li><Link to="/clients" className="hover:text-gray-200">Clients</Link></li>
        <li><Link to="/calendar" className="hover:text-gray-200">Calendar</Link></li>
        <li><Link to="/documents" className="hover:text-gray-200">Documents</Link></li>
      </ul>

      <div className="relative ml-4" ref={dropdownRef}>
        <img
          src={userImage}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
          onClick={() => setOpenProfile(!openProfile)}
        />

        {openProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
            <div className="p-4 flex flex-col items-center border-b">
              <img
                src={userImage}
                alt="Profile"
                className="w-16 h-16 rounded-full mb-2"
              />
              <p className="text-sm font-medium">{userFullName}</p>
              <p className="text-xs text-gray-600">{userEmail}</p>
            </div>
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-green-100"
              onClick={() => setOpenProfile(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-green-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
