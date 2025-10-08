import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Candidate } from "@/types/candidate";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/candidate");
      setCandidates(Array.isArray(data.candidates) ? data.candidates : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return { candidates, loading, error, refetch: fetchCandidates };
};


