import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ENV
    ? `http://${process.env.REACT_APP_ENV}:4000`
    : "http://localhost:4000/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
