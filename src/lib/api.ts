import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.VITE_API_URL as string) || 'http://localhost:5000'
});

export default api;
