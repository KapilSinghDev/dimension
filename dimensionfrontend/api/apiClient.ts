import * as axios from "axios";
const base_url = "http://localhost:8000/dimension/api";
export const apiclient: axios.AxiosInstance = axios.create({
  baseURL: base_url,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

apiclient.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiclient.interceptors.response.use(
  (response) => {
    let token = null;
    if (typeof response.data === "string" && response.data.trim() !== "") {
      token = response.data;
    } else if (response.data?.token) {
      token = response.data.token;
    }
    if (token) {
      localStorage.setItem("TOKEN", token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("TOKEN");
      window.location.href = "/welcome?tab=signup";
    }
    return Promise.reject(error);
  },
);
