import axios from 'axios';
import { User } from '../../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, url: `${API_URL}/auth/login` });
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Check if response has the expected structure
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Make sure user data exists before storing it
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
      
      // Provide more specific error message based on the error type
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Server response:', error.response.data);
          throw new Error(error.response.data.message || `Login failed: Server error (${error.response.status})`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          throw new Error('Login failed: No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request
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
