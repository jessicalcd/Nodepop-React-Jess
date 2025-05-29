import axios from 'axios';

const getAuthToken = (): string | null => {
  return null; 
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});


apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); 
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Error 401: No autorizado. Redirigir al login o limpiar token.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;