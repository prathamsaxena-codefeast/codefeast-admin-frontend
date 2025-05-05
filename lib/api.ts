import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    // Fetch the access token from sessionStorage
    const accessToken = sessionStorage.getItem("accessToken");
    console.log("Interceptor AccessToken:", accessToken); // Debugging

    // Add the Authorization header if the access token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add the server token to the headers
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

export default api;