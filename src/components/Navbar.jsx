import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutService } from "../services/authService";
import SearchBar from "./SearchBar";
import {
  FaHome,
  FaFolderOpen,
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaSearch,
  FaBars,
  FaTimes
} from "react-icons/fa";

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // User info from local storage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userFullName = user.full_name || "John Doe";
  const userEmail = user.email || "user@example.com";
  const userImage = user.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format";
  const userRole = user.role || "Admin";

  // Navbar gradient
  const navbarGradient = "from-green-700 to-green-500";

  // Sample notifications
  useEffect(() => {
    const sampleNotifications = [
      { id: 1, message: "New case assigned to you", time: "5 min ago", read: false, type: "case" },
      { id: 2, message: "Payment received for Case #123", time: "1 hour ago", read: false, type: "payment" },
      { id: 3, message: "Court date reminder: Tomorrow at 10 AM", time: "2 hours ago", read: true, type: "reminder" },
      { id: 4, message: "Document approved by client", time: "1 day ago", read: true, type: "document" }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutService();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/cases", label: "Cases", icon: FaFolderOpen },
    { path: "/clients", label: "Clients", icon: FaUsers },
    { path: "/calendar", label: "Calendar", icon: FaCalendarAlt },
    { path: "/documents", label: "Documents", icon: FaFileAlt },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpenMobileMenu(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`bg-gradient-to-r ${navbarGradient} text-white shadow-lg px-4 py-3 flex items-center justify-between relative z-50`}
      >
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-green-600 transition-colors"
            aria-label="Toggle menu"
          >
            {openMobileMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-lg">SJ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-serif">Satyamev Jayate</h1>
              <p className="text-xs text-green-100">Justice Management System</p>
            </div>
          </Link>
        </div>

        {/* Center Section - Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Right Section - Navigation and Profile */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-green-600 text-white shadow-inner"
                      : "text-green-100 hover:bg-green-600 hover:text-white"
                    }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Notifications"
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""
                          }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200">
                  <Link
                    to="/notifications"
                    className="block text-center text-sm text-green-600 hover:text-green-800 font-medium py-2"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-green-600 transition-colors group"
              aria-label="User menu"
            >
              <img
                src={userImage}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-green-300 group-hover:border-green-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{userFullName}</p>
                <p className="text-xs text-green-200">{userRole}</p>
              </div>
              <FaChevronDown
                size={12}
                className={`text-green-200 transition-transform ${openProfile ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-200">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={userImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-green-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {userFullName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{userEmail}</p>
                      <p className="text-xs text-green-600 font-medium">{userRole}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Links */}
                <div className="p-2">
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setOpenProfile(false)}
                  >
                    <FaCog className="text-gray-500" size={16} />
                    <span>Settings</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="lg:hidden bg-green-600 px-4 py-2 border-t border-green-500">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Mobile Menu */}
      {openMobileMenu && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-200 z-40">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => setOpenMobileMenu(false)}
                >
                  <Icon size={16} className={isActive ? "text-green-600" : "text-gray-500"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Profile Links */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setOpenMobileMenu(false)}
              >
                <FaUserCircle className="text-gray-500" size={16} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setOpenMobileMenu(false)}
              >
                <FaCog className="text-gray-500" size={16} />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {openMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpenMobileMenu(false)}
        />
      )}
    </>
  );
};

export default Navbar;