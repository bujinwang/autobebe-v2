import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Updated to use autobebe-v2/backend

interface AuthResponse {
  token: string;
  expiresAt: number;
}

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    
    const authData: AuthResponse = response.data;
    
    await AsyncStorage.setItem('authToken', authData.token);
    await AsyncStorage.setItem('tokenExpiry', authData.expiresAt.toString());
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const expiryStr = await AsyncStorage.getItem('tokenExpiry');
    
    if (!token || !expiryStr) {
      return null;
    }
    
    const expiry = parseInt(expiryStr);
    const now = Date.now();
    
    if (now >= expiry) {
      // Token expired, clear it
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('tokenExpiry');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('tokenExpiry');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}; 