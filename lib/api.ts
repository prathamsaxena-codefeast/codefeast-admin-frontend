import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const setAuthInterceptor = (getAccessToken: () => string | null) => {
  api.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Ensure the `server` header is set correctly
      const serverToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      if (serverToken) {
        config.headers["server"] = serverToken;
      } else {
        console.warn("Warning: NEXT_PUBLIC_AUTH_TOKEN is not set in the environment variables.");
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default api;