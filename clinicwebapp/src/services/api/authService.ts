import axiosInstance from './axiosConfig';
import axios from 'axios';
import { User } from '../../types';


// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: async (email: string, password: string) => {
    try {
      
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          console.error('Login response missing user data');
          throw new Error('Invalid response format: missing user data');
        }
      } else {
        console.error('Login response missing token', response.data);
        throw new Error('Invalid response format: missing token');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server response:', error.response.data);
          throw new Error(error.response.data.message || `Login failed: Server error (${error.response.status})`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw new Error('Login failed: No response from server. Please check your connection.');
        } else {
          throw new Error(`Login failed: ${error.message}`);
        }
      }
      
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
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  setCurrentClinic: async (clinicId: number): Promise<void> => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        
        // Update on the server
        await axiosInstance.put(`/users/${user.id}`, { 
          defaultClinicId: clinicId 
        });
        
        // Update locally
        user.defaultClinicId = clinicId;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Error updating user clinic:', e);
      throw e;
    }
  }
};

export default authService;
