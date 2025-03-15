import { User } from '../../types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email: username, password });
      
      // Store token and user data if login successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

export default authService;