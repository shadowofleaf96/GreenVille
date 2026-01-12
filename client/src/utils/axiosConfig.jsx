import axios from "axios";
import { handleUnauthorized } from "./sessionUtils";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const createAxiosInstance = (userType) => {
  const AxiosInstance = axios.create({
    baseURL: `${backendUrl}/v1/`,
  });

  AxiosInstance.interceptors.request.use(
    (config) => {
      let token;
      if (userType === "customer") {
        token = localStorage.getItem("customer_access_token");
      } else if (userType === "admin") {
        token = localStorage.getItem("user_access_token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        handleUnauthorized(userType);
      }
      return Promise.reject(error);
    }
  );

  return AxiosInstance;
};

export default createAxiosInstance;
