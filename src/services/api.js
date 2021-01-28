import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.matheuscst.com',
});

export default api;
