import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:5000/api';

// Define the Appointment interface
export interface Appointment {
  id?: number;
  patientId: number;
  appointmentDate: string;
  status: string;
  purposeOfVisit: string;
  symptoms: string;
  followUpQuestions: string;
  followUpAnswers: string;
  possibleTreatments: string;
  suggestedPrescriptions: string;
}

// Create an appointment
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  try {
    const response = await axios.post(`${API_URL}/Appointment`, appointment);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Get appointments by patient ID
export const getAppointmentsByPatientId = async (patientId: number): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_URL}/Appointment/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    const response = await axios.get(`${API_URL}/Appointment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (id: number, appointment: Appointment): Promise<Appointment> => {
  try {
    const response = await axios.put(`${API_URL}/Appointment/${id}`, appointment);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/Appointment/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}; 