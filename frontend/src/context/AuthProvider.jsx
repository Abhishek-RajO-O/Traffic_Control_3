import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { email, token, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser, token: storedToken });
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
