import { useEffect, useState } from "react";
import api from "@/lib/api";

// Define the Contact type
export interface Contact {
  _id: string; // Use _id instead of id
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt?: string; // Optional property
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