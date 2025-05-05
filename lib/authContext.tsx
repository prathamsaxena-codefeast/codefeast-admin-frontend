"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  const getAccessToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("accessToken");
    }
    return null;
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    console.log("Setting AccessToken:", accessToken); // Debugging
    sessionStorage.setItem("accessToken", accessToken); // Save accessToken in sessionStorage
    setRefreshToken(refreshToken);
  };

  const clearTokens = () => {
    sessionStorage.removeItem("accessToken"); // Remove accessToken from sessionStorage
    setRefreshToken(null);
    setUser(null);
  };

    const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/user/login", { email, password });
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const errorResponse = (error as { response?: { data?: { message?: string } } }).response;
        console.error("Login failed:", errorResponse?.data?.message || error.message);
      } else {
        console.error("Login failed:", error);
      }
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await api.post("/user/logout");
      clearTokens();
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const errorResponse = (error as { response?: { data?: { message?: string } } }).response;
        console.error("Logout failed:", errorResponse?.data?.message || error.message);
      } else {
        console.error("Logout failed:", error);
      }
    }
  };

  useEffect(() => {
    // Dynamically add the Authorization header to each request
    const interceptor = api.interceptors.request.use(
      (config) => {
        const accessToken = getAccessToken(); // Retrieve accessToken from sessionStorage
        if (accessToken) {
          console.log("Adding AccessToken to Request:", accessToken); // Debugging
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []); // Run this effect once when the component mounts

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: getAccessToken(),
        refreshToken,
        login,
        logout,
        setTokens,
        clearTokens,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};