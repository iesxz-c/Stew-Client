import axios from 'axios';

// Create an instance with default headers
const AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Replace with your token retrieval logic
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default AxiosInstance;