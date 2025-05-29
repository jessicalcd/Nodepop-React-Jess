import axios from 'axios';
import { getStoredToken } from '../utils/storage'; 

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Error 401: No autorizado desde interceptor. El AuthContext debería manejar el logout.');
    return Promise.reject(error);
  }
);

export default apiClient;