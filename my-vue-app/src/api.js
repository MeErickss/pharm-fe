// src/api.js
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para capturar 401 em qualquer chamada
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // limpa sinal de login e redireciona
      localStorage.removeItem('login');
     window.location.href = '/';
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;
