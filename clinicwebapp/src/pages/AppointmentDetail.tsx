import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Appointment } from '../types';
import { appointmentService } from '../services/api';
import Layout from '../components/Layout';

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentById(parseInt(id));
        setAppointment(data);
      } catch (err) {
        console.error('Failed to fetch appointment:', err);
        setError('Failed to load appointment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbar({
          open: true,
          message: `${label} copied to clipboard`,
          severity: 'success'
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Failed to copy to clipboard',
          severity: 'error'
        });
      });
  };

  const handleCompleteAppointment = async () => {
    if (!appointment) return;
    
    try {
      await appointmentService.updateAppointment(appointment.id, {
        status: 'completed'
      });
      
      setAppointment({
        ...appointment,
        status: 'completed'
      });
      
      setSnackbar({
        open: true,
        message: 'Appointment marked as completed',
        severity: 'success'
      });
    } catch (err) {
      console.error('Failed to update appointment:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update appointment status',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !appointment) {
    return (
      <Layout>
        <Box sx={{ my: 4 }}>
          <Typography color="error" align="center">{error || 'Appointment not found'}</Typography>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/appointments')}
            sx={{ mt: 2 }}
          >
            Back to Appointments
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/appointments')}
          sx={{ mb: 2 }}
        >
          Back to Appointments
        </Button>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Appointment Details
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={appointment.status} 
              color={
                appointment.status === 'completed' ? 'success' :
                appointment.status === 'in-progress' ? 'warning' :
                appointment.status === 'cancelled' ? 'error' : 'info'
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Patient Information" />
            <CardContent>
              <Typography variant="h6">{appointment.patient?.name || 'Unknown Patient'}</Typography>
              <Typography variant="body2" color="text.secondary">
                DOB: {appointment.patient?.dateOfBirth ? 
                  format(new Date(appointment.patient.dateOfBirth), 'MMM d, yyyy') : 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gender: {appointment.patient?.gender || 'Unknown'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                Phone: {appointment.patient?.phone || 'Unknown'}
              </Typography>
              <Typography variant="body2">
                Email: {appointment.patient?.email || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Appointment Information" 
              subheader={format(new Date(appointment.appointmentDate), 'MMMM d, yyyy h:mm a')}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>Chief Complaint</Typography>
              <Typography paragraph>{appointment.chiefComplaint}</Typography>
              
              <Typography variant="h6" gutterBottom>Symptoms</Typography>
              <Typography paragraph>{appointment.symptoms}</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Medical History</Typography>
              <Typography paragraph>{appointment.medicalHistory || 'None provided'}</Typography>
              
              <Typography variant="h6" gutterBottom>Current Medications</Typography>
              <Typography paragraph>{appointment.currentMedications || 'None provided'}</Typography>
              
              <Typography variant="h6" gutterBottom>Allergies</Typography>
              <Typography paragraph>{appointment.allergies || 'None provided'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            // Fix the CardHeader action with IconButton
            <CardHeader
              title="Treatment Recommendations"
              action={
                <IconButton
                  aria-label="copy treatment recommendations"
                  onClick={() => handleCopyToClipboard(appointment.possibleTreatments || '', 'Treatment recommendations')}
                >
                  <CopyIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography paragraph>
                {appointment.possibleTreatments || 'No treatment recommendations available'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            // Fix the CardHeader for prescriptions
            <CardHeader
              title="Prescription Recommendations"
              action={
                <IconButton
                  aria-label="copy prescription recommendations"
                  onClick={() => handleCopyToClipboard(appointment.suggestedPrescriptions || '', 'Prescription recommendations')}
                >
                  <CopyIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography paragraph>
                {appointment.suggestedPrescriptions || 'No prescription recommendations available'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={handleCompleteAppointment}
              disabled={appointment.status === 'completed'}
            >
              {appointment.status === 'completed' ? 'Appointment Completed' : 'Mark as Completed'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default AppointmentDetail;