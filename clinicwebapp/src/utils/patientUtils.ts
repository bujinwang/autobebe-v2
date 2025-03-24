import { Patient } from '../types';

export const getPatientFullName = (patient?: Patient): string => {
  if (!patient) return 'Unknown Patient';
  return patient.name;
};

export const getPatientPhone = (patient?: Patient): string => {
  if (!patient) return '';
  return patient.phone;
}; 