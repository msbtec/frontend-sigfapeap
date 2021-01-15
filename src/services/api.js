import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sigfapeapdeploy.leozartino.com.br',
});

export default api;
