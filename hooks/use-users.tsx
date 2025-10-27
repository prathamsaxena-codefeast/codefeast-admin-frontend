import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/user");
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
