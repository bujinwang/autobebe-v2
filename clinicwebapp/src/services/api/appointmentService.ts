import axios from 'axios';
import { Appointment } from '../../types';
import { isSameDay, parseISO } from 'date-fns';
import authService from './authService';

// Update API URL to match your backend port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios with auth token
const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const appointmentService = {
  // Get all appointments (no date filter)
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      throw error;
    }
  },

  // Get appointments by date
  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        params: { date },
        headers: getAuthHeader()
      });
      
      // If the backend doesn't support date filtering, we can do it client-side
      if (!response.data.some((appointment: Appointment) => 
        'date' in appointment && appointment.date === date)) {
        const dateObj = parseISO(date);
        return response.data.filter((appointment: Appointment) => 
          isSameDay(parseISO(appointment.appointmentDate), dateObj)
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by date:', error);
      throw error;
    }
  },

  // Get appointments by patient ID
  getAppointmentsByPatient: async (patientId: number): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`${API_URL}/appointments/patient/${patientId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by patient:', error);
      throw error;
    }
  },

  // Get a single appointment by ID
  getAppointmentById: async (id: number): Promise<Appointment> => {
    try {
      const response = await axios.get(`${API_URL}/appointments/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Update an appointment
  updateAppointment: async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axios.put(`${API_URL}/appointments/${id}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/appointments/${id}`, {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error(`Error deleting appointment with ID ${id}:`, error);
      throw error;
    }
  }
};

export default appointmentService;
