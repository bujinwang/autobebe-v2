import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  SelectChangeEvent,
  FormHelperText,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { appointmentService, patientService, staffService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Appointment, Patient, Doctor } from '../types';

interface NewAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAppointmentCreated: () => void;
}

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AppointmentFormData {
  appointmentDate: Dayjs;
  purposeOfVisit: string;
  symptoms: string;
}

const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  open,
  onClose,
  onAppointmentCreated,
}) => {
  const { user } = useAuth();
  const [patientFormData, setPatientFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [appointmentFormData, setAppointmentFormData] = useState<AppointmentFormData>({
    appointmentDate: dayjs(),
    purposeOfVisit: '',
    symptoms: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!user?.defaultClinicId) {
        throw new Error('No clinic selected');
      }

      // Format the patient data to match server schema
      const patientData = {
        name: `${patientFormData.firstName.trim()} ${patientFormData.lastName.trim()}`,
        email: patientFormData.email.trim().toLowerCase(),
        phone: patientFormData.phone.trim(),
        clinicId: user.defaultClinicId,
      };

      console.log('Creating patient with data:', patientData);

      // Create new patient
      const newPatient = await patientService.createPatient(patientData);

      console.log('Patient created successfully:', newPatient);

      // Format the appointment data
      const appointmentData: Partial<Appointment> = {
        patientId: newPatient.id,
        clinicId: user.defaultClinicId,
        appointmentDate: appointmentFormData.appointmentDate.toISOString(),
        status: 'scheduled',
        purposeOfVisit: appointmentFormData.purposeOfVisit.trim(),
        symptoms: appointmentFormData.symptoms.trim(),
        followUpAnswers: '',
        followUpQuestions: '',
        possibleTreatments: '',
        suggestedPrescriptions: ''
      };

      console.log('Creating appointment with data:', appointmentData);

      await appointmentService.createAppointment(appointmentData);
      onAppointmentCreated();
      onClose();
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      setError(err.message || 'Failed to create appointment');
    }
  };

  const handlePatientFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAppointmentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointmentFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={patientFormData.firstName}
                onChange={handlePatientFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={patientFormData.lastName}
                onChange={handlePatientFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={patientFormData.email}
                onChange={handlePatientFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={patientFormData.phone}
                onChange={handlePatientFormChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Appointment Date & Time"
                  value={appointmentFormData.appointmentDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setAppointmentFormData(prev => ({
                        ...prev,
                        appointmentDate: newValue
                      }));
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purpose of Visit"
                name="purposeOfVisit"
                value={appointmentFormData.purposeOfVisit}
                onChange={handleAppointmentFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Symptoms"
                name="symptoms"
                value={appointmentFormData.symptoms}
                onChange={handleAppointmentFormChange}
                multiline
                rows={3}
                required
              />
            </Grid>
          </Grid>
          {error && (
            <Box sx={{ mt: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewAppointmentDialog; 