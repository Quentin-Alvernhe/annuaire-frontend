// stores/auth.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as string | null,
    token: null as string | null,
    isAuthenticated: false
  }),
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isAdmin: (state) => state.isAuthenticated
  },
  
  actions: {
    async login(username: string, password: string) {
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.apiBaseUrl}/auth/login`, {
          username,
          password
        });
        
        const { token, username: user } = response.data;
        
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        // Stockage dans le localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        
        return true;
      } catch (error) {
        console.error('Erreur de connexion:', error);
        return false;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      
      // Nettoyage du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirection vers la page d'accueil
      navigateTo('/');
    },
    
    checkAuth() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        return true;
      }
      
      return false;
    }
  }
});