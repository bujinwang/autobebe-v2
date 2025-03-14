import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuthToken } from './authService';

// Base URL for the services
const API_BASE_URL = 'http://localhost:3000/api'; // Updated to use correct backend port

export interface ClinicInfo {
  id: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  hours: string;
  welcomeMessage: string;
}

// Function to clear the clinic info cache
export const clearClinicInfoCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('clinicInfo');
    await AsyncStorage.removeItem('clinicInfoTimestamp');
    console.log('Clinic info cache cleared successfully');
  } catch (error) {
    console.error('Error clearing clinic info cache:', error);
  }
};

export const getClinicInfoById = async (clinicId: string): Promise<ClinicInfo> => {
  try {
    console.log('Fetching clinic info for ID:', clinicId);
    const response = await axios.get(`${API_BASE_URL}/clinic/info?id=${clinicId}`);
    if (!response.data) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic info:', error);
    throw error;
  }
};

export const getClinicInfo = async (forceRefresh = false): Promise<ClinicInfo> => {
  try {
    console.log('Fetching clinic info, forceRefresh:', forceRefresh);
    
    // Skip cache check if forceRefresh is true
    if (!forceRefresh) {
      console.log('Checking cache...');
      // First check if we have cached data
      const cachedData = await AsyncStorage.getItem('clinicInfo');
      const cachedTimestamp = await AsyncStorage.getItem('clinicInfoTimestamp');
      
      // Use cache if it's less than 1 hour old
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        if (now - timestamp < 3600000) { // 1 hour in milliseconds
          console.log('Using cached clinic info');
          return JSON.parse(cachedData);
        }
      }
    }
    
    console.log('Making API request to:', `${API_BASE_URL}/Clinic/info?id=4F420955`);
    
    // Fetch from the API
    const response = await axios.get(`${API_BASE_URL}/Clinic/info?id=4F420955`, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('API response received:', response.status);
    const clinicData = response.data;
    
    // Cache the data with timestamp
    await AsyncStorage.setItem('clinicInfo', JSON.stringify(clinicData));
    await AsyncStorage.setItem('clinicInfoTimestamp', Date.now().toString());
    console.log('Clinic info cached successfully');
    
    return clinicData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching clinic info:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      });
    } else {
      console.error('Non-Axios error fetching clinic info:', error);
    }
    
    // If forceRefresh is true, don't use cache as fallback
    if (!forceRefresh) {
      console.log('Attempting to use cached data as fallback...');
      // If we have cached data, return it as fallback
      const cachedData = await AsyncStorage.getItem('clinicInfo');
      if (cachedData) {
        console.log('Using cached data as fallback');
        return JSON.parse(cachedData);
      }
    }
    
    // If all else fails, throw the error
    throw error;
  }
};