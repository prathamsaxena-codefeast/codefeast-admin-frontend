'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/auth/me");
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setUser?.(res.data.user);
          setToken?.(token);
          router.replace("/contacts");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      }
    };

    checkUser();
  }, [router, setUser, setToken]);

  return null;
}