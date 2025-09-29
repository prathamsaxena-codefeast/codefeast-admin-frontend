"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      router.replace("/contacts"); 
    } else {
      router.replace("/login"); 
    }
  }, [router]);

  return null;
}
