import { useEffect, useState } from "react";
import api from "@/lib/api";

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get("/contact");
        setContacts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contacts, loading, error };
};