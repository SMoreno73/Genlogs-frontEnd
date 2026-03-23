import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const searchRoutes = async ({ from, to }) => {
  const response = await api.post('/search', { from, to });
  console.log(response.data);
  
  return response.data;
};

export default api;
