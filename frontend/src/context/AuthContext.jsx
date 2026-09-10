
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "palitpurconnect_user";
const ACCESS_TOKEN_KEY = "palitpurconnect_access_token";
const REFRESH_TOKEN_KEY = "palitpurconnect_refresh_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      // Show cached user immediately if available.
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      try {
        /*
         * IMPORTANT:
         *
         * Always call /auth/me.
         *
         * Normal login may authenticate with a JWT.
         * Google OAuth authenticates with the Express session cookie.
         *
         * api.js already uses:
         * credentials: "include"
         *
         * so the Google session cookie will be sent here.
         */
        const response = await api.me();

        const currentUser =
          response.user ||
          response.data?.user ||
          null;

        if (currentUser) {
          setUser(currentUser);

          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(currentUser)
          );
        } else {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (error) {
        /*
         * A 401 simply means there is no valid session.
         * This is normal for a guest visiting the website.
         */
        if (
          !error.message?.toLowerCase().includes("authentication required")
        ) {
          console.error("Session restore failed:", error);
        }

        /*
         * Only clear local JWT/session cache when authentication
         * actually failed.
         */
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (authData) => {
    const accessToken =
      authData?.accessToken ||
      authData?.data?.accessToken ||
      authData?.token;

    const refreshToken =
      authData?.refreshToken ||
      authData?.data?.refreshToken;

    const loggedInUser =
      authData?.user ||
      authData?.data?.user;

    if (accessToken) {
      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
      );
    }

    if (refreshToken) {
      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        refreshToken
      );
    }

    if (loggedInUser) {
      setUser(loggedInUser);

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(loggedInUser)
      );
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null);

      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
