import * as axios from "axios";
const base_url = "http://localhost:3000/dimension/api";
export const apiclient: axios.AxiosInstance = axios.create({
  baseURL: base_url,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

apiclient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiclient.interceptors.response.use(
  (response) => response,
  (error: axios.AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
