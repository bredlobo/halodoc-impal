import { createContext, useContext, useState, useEffect } from "react";
import http from "../lib/axios";
import { destroySocket } from "../lib/socket";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    if (userToken) {
      localStorage.setItem("token", userToken);
      http.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete http.defaults.headers.common["Authorization"];
    destroySocket(); // disconnect socket on logout
  };

  useEffect(() => {
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
