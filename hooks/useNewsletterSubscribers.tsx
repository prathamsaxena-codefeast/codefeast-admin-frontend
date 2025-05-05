import { useEffect, useState } from "react";
import api from "@/lib/api";

export interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export const useNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data } = await api.get("/newsletter");
        setSubscribers(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return { subscribers, loading, error };
};