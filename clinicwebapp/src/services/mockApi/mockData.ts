import { User, Clinic, Doctor, Patient, Appointment } from '../../types';

// Mock Clinics
export const clinics: Clinic[] = [
  {
    id: 1,
    name: 'Main Street Clinic',
    address: '123 Main St, Anytown, USA',
    phone: '555-123-4567'
  },
  {
    id: 2,
    name: 'Downtown Medical Center',
    address: '456 Downtown Ave, Anytown, USA',
    phone: '555-987-6543'
  }
];

// Mock Doctors
export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. John Smith',
    specialization: 'Pediatrics',
    clinics: [clinics[0]],
    isActive: true
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    specialization: 'Family Medicine',
    clinics: [clinics[0], clinics[1]],
    isActive: true
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    specialization: 'Internal Medicine',
    clinics: [clinics[1]],
    isActive: false
  }
];

// Mock Patients
export const patients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    phone: "555-123-4567",
    email: "john.doe@example.com",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: 'Emma Wilson',
    dateOfBirth: '2018-05-15',
    gender: 'Female',
    phone: '555-111-2222',
    email: 'parent@example.com',
    createdAt: "2023-02-10T14:20:00Z",
    updatedAt: "2023-02-10T14:20:00Z"
  },
  {
    id: 3,
    name: 'Noah Garcia',
    dateOfBirth: '2020-02-10',
    gender: 'Male',
    phone: '555-333-4444',
    email: 'parent2@example.com',
    createdAt: "2023-03-05T09:15:00Z",
    updatedAt: "2023-03-05T09:15:00Z"
  }
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    clinicId: 1,
    appointmentDate: new Date().toISOString(),
    status: 'scheduled',
    chiefComplaint: 'Fever and cough',
    symptoms: 'Fever of 101°F, coughing for 2 days, runny nose',
    medicalHistory: 'Asthma',
    currentMedications: 'Albuterol inhaler as needed',
    allergies: 'Penicillin',
    possibleTreatments: 'Rest, fluids, and monitoring. Consider antipyretics for fever.',
    suggestedPrescriptions: "Children's acetaminophen 160mg/5mL, 5mL every 4-6 hours as needed for fever.",
    patient: patients[0],
    doctor: doctors[0],
    clinic: clinics[0]
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 2,
    clinicId: 1,
    appointmentDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    chiefComplaint: 'Ear pain',
    symptoms: 'Right ear pain for 3 days, slight fever',
    medicalHistory: 'None',
    currentMedications: 'None',
    allergies: 'None',
    possibleTreatments: 'Evaluate for otitis media. Consider antibiotics if indicated.',
    suggestedPrescriptions: 'Amoxicillin 250mg/5mL, 5mL twice daily for 10 days if bacterial infection confirmed.',
    patient: patients[1],
    doctor: doctors[1],
    clinic: clinics[0]
  }
];

// Mock Users
export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Admin User',
    role: 'admin',
    defaultClinicId: 1,
    clinics: clinics
  },
  {
    id: 2,
    username: 'doctor',
    name: 'Doctor User',
    role: 'doctor',
    defaultClinicId: 1,
    clinics: [clinics[0]]
  }
];