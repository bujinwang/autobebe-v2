export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  defaultClinicId?: number;
  clinics?: Clinic[];
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  clinics: Clinic[];
  isActive: boolean;
}

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  appointmentDate: string;
  status: string;
  chiefComplaint: string;
  symptoms: string;
  medicalHistory?: string;
  currentMedications?: string;
  allergies?: string;
  possibleTreatments?: string;
  suggestedPrescriptions?: string;
  patient?: Patient;
  doctor?: Doctor;
  clinic?: Clinic;
}