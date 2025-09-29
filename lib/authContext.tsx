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
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
      if (!savedToken) {
        setLoading(false);
        router.replace("/login");
        return;
      }
  
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
  
        if (res.data.user) {
          const userData: User = {
            email: res.data.user.email,
            role: res.data.user.role,
            username: res.data.user.name,
          };
  
          setToken(savedToken);
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          router.replace("/login");
        }
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
  
    initAuth();
  }, [router]);
  
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role, username } = res.data;

      const userData: User = { email, role, username };

      localStorage.setItem("token", token);

      setUser(userData);
      setToken(token);

      router.push("/contacts");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const storedToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (storedToken) config.headers.Authorization = `Bearer ${storedToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};