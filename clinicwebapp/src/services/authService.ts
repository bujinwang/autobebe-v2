import axios from 'axios';
import { API_BASE_URL } from '../config';
import { User } from '../types';

class AuthService {
  private baseUrl = `${API_BASE_URL}/auth`;
  private tokenKey = 'token';
  private userKey = 'user';

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));

      return { token, user };
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    clinicId: string;
  }) {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/forgot-password`, { email });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to send reset password email');
      }
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/reset-password`, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to reset password');
      }
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${this.getToken()}` },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to change password');
      }
      throw error;
    }
  }

  setCurrentClinic(clinicId: number) {
    const user = this.getCurrentUser();
    if (user) {
      const updatedUser = { ...user, defaultClinicId: clinicId };
      localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    }
  }
}

export default new AuthService(); 