import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:3000/api';

// Define the Appointment interface to match sanya-service
export interface Appointment {
  id?: number;
  patientId: number;
  clinicId: string; // Make sure clinicId is included here
  appointmentDate: string;
  status: string;
  purposeOfVisit?: string;
  symptoms?: string;
  followUpAnswers: string;
  followUpQuestions: string;
  possibleTreatments: string;
  suggestedPrescriptions: string;
}

// Create an appointment
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  try {
    // Validate required IDs
    if (!appointment.patientId) {
      throw new Error('Patient ID is required');
    }
    
    if (!appointment.clinicId) {
      throw new Error('Clinic ID is required');
    }
    
    // Ensure required fields have default values
    const appointmentData = {
      ...appointment,
      followUpAnswers: appointment.followUpAnswers || '',
      followUpQuestions: appointment.followUpQuestions || '',
      possibleTreatments: appointment.possibleTreatments || '',
      suggestedPrescriptions: appointment.suggestedPrescriptions || ''
    };
    
    console.log('Sending appointment data:', JSON.stringify(appointmentData, null, 2));
    
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error.response) {
      console.error('Server response data:', error.response.data);
      console.error('Server response status:', error.response.status);
    }
    throw error;
  }
};

// Get appointments by patient ID
export const getAppointmentsByPatientId = async (patientId: number): Promise<Appointment[]> => {
  try {
    // Updated to use lowercase plural endpoint to match backend
    const response = await axios.get(`${API_URL}/appointments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    // Updated to use lowercase plural endpoint to match backend
    const response = await axios.get(`${API_URL}/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (id: number, appointment: Appointment): Promise<Appointment> => {
  try {
    // Updated to use lowercase plural endpoint to match backend
    const response = await axios.put(`${API_URL}/appointments/${id}`, appointment);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: number): Promise<boolean> => {
  try {
    // Updated to use lowercase plural endpoint to match backend
    await axios.delete(`${API_URL}/appointments/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};