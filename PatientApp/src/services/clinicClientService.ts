import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { isAxiosError } from '../api/client';
import { AxiosError } from 'axios';

// Base URL for the services

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
    const response = await apiClient.get(`/public/clinics/info`, {
      params: { id: clinicId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic info:', error);
    
    // Return mock data if in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock clinic data');
      return {
        id: clinicId || '4F420955',
        name: "Naomi's Clinic",
        company: "Naomi's Healthcare",
        address: '123 Healthcare St',
        phone: '555-0123',
        hours: '9:00 AM - 5:00 PM',
        welcomeMessage: 'Welcome to our clinic!'
      };
    }
    throw error;
  }
};

export const getClinicList = async (): Promise<ClinicInfo[]> => {
  try {
    const response = await apiClient.get('/public/clinics/list');
    if (!response.data) {
      throw new Error('No data received from clinics endpoint');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic list:', error);
    
    // Return mock data if in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock clinic list data');
      return [
        {
          id: '4F420955',
          name: "Naomi's Clinic",
          company: "Naomi's Healthcare",
          address: '123 Healthcare St',
          phone: '555-0123',
          hours: '9:00 AM - 5:00 PM',
          welcomeMessage: 'Welcome to our clinic!'
        },
        {
          id: '4F420956',
          name: "City Medical Center",
          company: "City Healthcare",
          address: '456 Medical Ave',
          phone: '555-0124',
          hours: '8:00 AM - 6:00 PM',
          welcomeMessage: 'Serving our community with care!'
        }
      ];
    }
    throw error;
  }
};