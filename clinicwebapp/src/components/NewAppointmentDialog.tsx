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
  CircularProgress,
  keyframes,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { appointmentService, patientService, staffService, getTopQuestions } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Appointment, Patient, Doctor } from '../types';
import { SmartToy as SmartToyIcon } from '@mui/icons-material';

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

interface DynamicQuestion {
  id: string;
  question: string;
  answer: string;
}

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

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
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);

  const handleAppointmentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointmentFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchDynamicQuestions = async () => {
    if (!appointmentFormData.purposeOfVisit.trim() || !appointmentFormData.symptoms.trim()) {
      return;
    }

    setIsLoadingQuestions(true);
    try {
      const response = await getTopQuestions({
        purposeOfVisit: appointmentFormData.purposeOfVisit,
        symptoms: appointmentFormData.symptoms
      });

      if (response.success && response.topQuestions.length > 0) {
        const aiQuestions = response.topQuestions.map((question, index) => ({
          id: `ai-${index + 1}`,
          question: question,
          answer: ''
        }));
        setDynamicQuestions(aiQuestions);
      } else {
        // Use default questions if API call fails
        const defaultQuestions = [
          {
            id: 'default-1',
            question: 'How long have you been experiencing these symptoms?',
            answer: ''
          },
          {
            id: 'default-2',
            question: 'Have you taken any medication for these symptoms?',
            answer: ''
          },
          {
            id: 'default-3',
            question: 'Are your symptoms getting better, worse, or staying the same?',
            answer: ''
          }
        ];
        setDynamicQuestions(defaultQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Use default questions on error
      const defaultQuestions = [
        {
          id: 'default-1',
          question: 'How long have you been experiencing these symptoms?',
          answer: ''
        },
        {
          id: 'default-2',
          question: 'Have you taken any medication for these symptoms?',
          answer: ''
        },
        {
          id: 'default-3',
          question: 'Are your symptoms getting better, worse, or staying the same?',
          answer: ''
        }
      ];
      setDynamicQuestions(defaultQuestions);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionAnswerChange = (id: string, answer: string) => {
    setDynamicQuestions(questions =>
      questions.map(q => q.id === id ? { ...q, answer } : q)
    );
  };

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
        followUpQuestions: JSON.stringify(dynamicQuestions.map(q => q.question)),
        followUpAnswers: JSON.stringify(dynamicQuestions.map(q => q.answer)),
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>Create New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={1.5} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
                label="Phone"
                name="phone"
                value={patientFormData.phone}
                onChange={handlePatientFormChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
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
                      size: "small"
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Purpose of Visit"
                name="purposeOfVisit"
                value={appointmentFormData.purposeOfVisit}
                onChange={handleAppointmentFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  size="small"
                  label="Symptoms"
                  name="symptoms"
                  value={appointmentFormData.symptoms}
                  onChange={handleAppointmentFormChange}
                  multiline
                  rows={2} 
                  required
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchDynamicQuestions}
                  disabled={!appointmentFormData.purposeOfVisit.trim() || !appointmentFormData.symptoms.trim() || isLoadingQuestions}
                  sx={{ 
                    minWidth: '150px', 
                    mt: 0,
                    '& .MuiButton-startIcon': isLoadingQuestions ? {
                      animation: `${pulseAnimation} 1.5s infinite`,
                    } : {}
                  }}
                  size="small"
                  startIcon={<SmartToyIcon />}
                >
                  {isLoadingQuestions ? (
                    'Analyzing Symptoms...'
                  ) : (
                    'Virtual Medical Assistant'
                  )}
                </Button>
              </Box>
            </Grid>

            {dynamicQuestions.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
                    Follow-up Questions
                  </Typography>
                </Grid>
                {dynamicQuestions.map((question) => (
                  <Grid item xs={12} key={question.id}>
                    <Box sx={{ 
                      mb: 1, 
                      p: 1.5, 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      borderLeft: 3,
                      borderColor: 'primary.main'
                    }}>
                      <Typography variant="body2" gutterBottom>
                        {question.question}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={question.answer}
                        onChange={(e) => handleQuestionAnswerChange(question.id, e.target.value)}
                        multiline
                        rows={1}
                        required
                        placeholder="Your answer"
                      />
                    </Box>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
          {error && (
            <Box sx={{ mt: 1 }}>
              <Typography color="error" variant="body2">{error}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button onClick={onClose} size="small">Cancel</Button>
          <Button type="submit" variant="contained" color="primary" size="small">
            Create Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewAppointmentDialog; 