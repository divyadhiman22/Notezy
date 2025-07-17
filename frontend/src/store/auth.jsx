/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useContext, useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Creating context
export const AuthContext = createContext();

// Creating Provider
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  // const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); 

  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken); 
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const userAuthentication = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Error fetching user data", error);
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  // const getServices = async () => {
  //   try {
  //     const response = await fetch(`${BACKEND_URL}/api/data/service`, {
  //       method: "GET",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setServices(data.msg);
  //     }
  //   } catch (error) {
  //     console.log(`Services frontend error: ${error}`);
  //   }
  // };

  useEffect(() => {
    userAuthentication();
  }, [token]);

  // useEffect(() => {
  //   getServices();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        // services,
        authorizationToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
