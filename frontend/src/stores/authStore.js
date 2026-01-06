import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  // Actions
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      token.value = response.data.token;
      user.value = response.data.user;

      // Persist
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      return true;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { token, user, isAuthenticated, login, logout };
});