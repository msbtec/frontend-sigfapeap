import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sigfapeap.msbtec.com.br',
});

export default api;
