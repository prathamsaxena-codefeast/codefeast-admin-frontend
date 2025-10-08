import axios from "axios";

const SERVER_AUTH = process.env.SERVER_AUTH;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export const backendApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  }
});

backendApi.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined" && SERVER_AUTH) {
      config.headers["server"] = SERVER_AUTH;
    }
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch {
        console.warn("Warning: Failed to get token from cookies");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;