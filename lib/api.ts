import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    // Add the Authorization header if the session has an access token
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    // Add the server header for backend validation
    config.headers.server = process.env.NEXT_PUBLIC_AUTH_TOKEN;

    return config;
  },
  (error) => Promise.reject(error)
);

export default api; // Export the `api` instance as the default export