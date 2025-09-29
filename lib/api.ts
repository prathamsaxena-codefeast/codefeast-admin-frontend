import axios from "axios";

const SERVER_AUTH = process.env.NEXT_PUBLIC_SERVER_AUTH;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: "/api",
  headers: {
    server: SERVER_AUTH
  }
});

api.interceptors.request.use(
  async (config) => {
    const serverToken = process.env.NEXT_PUBLIC_AUTH_TOKEN || SERVER_AUTH;
    if (serverToken) {
      config.headers["server"] = serverToken;
    } else {
      console.warn("Warning: Server auth token is not set in the environment variables.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const backendApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    server: SERVER_AUTH
  }
});

backendApi.interceptors.request.use(
  async (config) => {
    if (SERVER_AUTH) {
      config.headers["server"] = SERVER_AUTH;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;