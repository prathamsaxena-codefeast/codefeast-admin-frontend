'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  role: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log('Response data:', res.data);
      const { token, role, username } = res.data;

      const userData: User = { email, role, username };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(token);

      router.push("/");
    } catch (error: any) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const storedToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
