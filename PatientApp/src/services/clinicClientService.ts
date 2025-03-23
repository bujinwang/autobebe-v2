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
    // Remove mock data and just throw the error
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
    // Remove mock data and just throw the error
    throw error;
  }
};