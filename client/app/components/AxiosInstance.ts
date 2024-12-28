// axiosInstance.ts
import axios from 'axios';
import { getToken } from '@/app/components/tokenUtility'; // Adjust the import to the actual path

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Use the environment variable
  headers: { 'Content-Type': 'application/json' }
});

// Add an interceptor to include the token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); // Retrieve the token from wherever it is stored
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
