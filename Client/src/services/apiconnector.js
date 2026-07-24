import axios from "axios";
import { endpoints } from "./apis";

const { REFRESH_TOKEN_API } = endpoints;

// ====================================================
// Axios Instance
// ====================================================

export const axiosInstance = axios.create({
  withCredentials: true,
});

// ====================================================
// Access Token Memory
// ====================================================

let accessToken = JSON.parse(localStorage.getItem("token")) || null;

// ====================================================
// Refresh State
// ====================================================

let isRefreshing = false;
let failedQueue = [];

// ====================================================
// Queue Processor
// ====================================================

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// ====================================================
// Request Interceptor
// ====================================================

axiosInstance.interceptors.request.use(
  (config) => {

    // Latest token memory se use karo
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.withCredentials = true;

    return config;

  },

  (error) => Promise.reject(error)
);

// ====================================================
// Response Interceptor
// ====================================================

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Agar response hi nahi hai
    if (!error.response) {
      return Promise.reject(error);
    }

    // 401 nahi hai to direct reject
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Authentication APIs ke liye refresh token use mat karo
const authRoutes = [
  "/login",
  "/signup",
  "/sendotp",
  "/google-auth",
];

const isAuthRoute = authRoutes.some((route) =>
  originalRequest.url?.includes(route)
);

if (isAuthRoute) {
  return Promise.reject(error);
}

    // Infinite loop se bachne ke liye
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Agar refresh already chal raha hai
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        REFRESH_TOKEN_API,
        {},
        {
          withCredentials: true,
        }
      );

      const newToken = refreshResponse.data.token;

      // Memory update
      accessToken = newToken;

      // Local Storage update
      localStorage.setItem("token", JSON.stringify(newToken));

      // Default Header update
      axiosInstance.defaults.headers.common.Authorization =
        `Bearer ${newToken}`;

      // Current Request update
      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      // Queue Resume
      processQueue(null, newToken);

      return axiosInstance(originalRequest);

    } catch (refreshError) {

      processQueue(refreshError, null);

      accessToken = null;

      localStorage.removeItem("token");

      delete axiosInstance.defaults.headers.common.Authorization;

      // Optional:
      // window.location.href="/login";

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

// ====================================================
// API Connector
// ====================================================

export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {

  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });

};