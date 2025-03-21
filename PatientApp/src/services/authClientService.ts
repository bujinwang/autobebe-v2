import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';


interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    clinicId?: string;
  };
}

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password
    });
    
    const authData = response.data;
    
    await AsyncStorage.setItem('authToken', authData.token);
    await AsyncStorage.setItem('tokenExpiry', (Date.now() + 8 * 60 * 60 * 1000).toString()); // 8 hours from now
    await AsyncStorage.setItem('userRole', authData.user.role);
    await AsyncStorage.setItem('clinicId', authData.user.clinicId || '');
    
    // Update apiClient authorization header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
    
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