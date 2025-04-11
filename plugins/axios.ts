// plugins/axios.ts
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Redirection vers la page d'accueil en cas d'erreur d'authentification
        navigateTo('/');
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance
    }
  };
});