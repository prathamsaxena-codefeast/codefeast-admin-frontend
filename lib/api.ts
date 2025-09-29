import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    console.log("Interceptor AccessToken:", accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

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