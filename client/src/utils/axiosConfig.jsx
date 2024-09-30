import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const createAxiosInstance = (userType) => {
  const AxiosInstance = axios.create({
    baseURL: `${backendUrl}/v1/`,
  });

  AxiosInstance.interceptors.request.use(
    (config) => {
      let token;
      if (userType === 'customer') {
        token = localStorage.getItem('customer_access_token');
      } else if (userType === 'admin') {
        token = localStorage.getItem('user_access_token');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return AxiosInstance;
};

export default createAxiosInstance;
