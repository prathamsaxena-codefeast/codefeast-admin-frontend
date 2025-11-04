import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Job } from "@/types/job";

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/job");
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch Jobs");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refetch: fetchJobs };
};
