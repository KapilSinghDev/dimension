import * as axios from "axios";
import Cookies from "js-cookie";

const base_url = "http://localhost:8000/dimension/api";

export const apiclient: axios.AxiosInstance = axios.create({
  baseURL: base_url,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

apiclient.interceptors.request.use((config) => {
  const token = Cookies.get("TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    return config;
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
      Cookies.set("TOKEN", token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("TOKEN");
    }
    return Promise.reject(error);
  },
);
