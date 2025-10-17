import { createContext, useState, useEffect } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem("user");
    console.log(savedUser);
    
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function
  const login = (userData, token) => {
  const userWithToken = {
    ...userData,
    token: token
  };

  localStorage.setItem("user", JSON.stringify(userWithToken));
  setUser(userWithToken);
};


  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
