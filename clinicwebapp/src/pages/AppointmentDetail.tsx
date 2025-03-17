import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  CardHeader,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  // useMediaQuery, // Remove if not using isMobile
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  Notes as NotesIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { Appointment } from '../types';
// Update this import to use the service from index.ts
import { appointmentService } from '../services/api';
import Layout from '../components/Layout';

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  // Check if coming from Today's appointments and if it was taken in
  const isFromTodayTab = location.state && location.state.source === 'today';
  const wasTakenIn = location.state && location.state.takenIn === true;
  
  // Remove isMobile if not using it
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '' });
  // Remove notes if not using it
  // const [notes, setNotes] = useState('');

  // Define fetchAppointment before using it in useEffect
  const fetchAppointment = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentById(parseInt(id));
      setAppointment(data);
      // If not using notes, remove this line
      // setNotes(data.possibleTreatments || '');
    } catch (err) {
      console.error('Failed to fetch appointment:', err);
      setError('Failed to load appointment details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Now use fetchAppointment in useEffect
  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

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

  const handleStatusChange = async (status: string) => {
    if (!appointment) return;
    
    try {
      await appointmentService.updateAppointment(appointment.id, { status });
      
      setAppointment({
        ...appointment,
        status
      });
      
      setSnackbar({
        open: true,
        message: `Appointment marked as ${status}`,
        severity: 'success'
      });
      
      setConfirmDialog({ open: false, action: '' });
    } catch (err) {
      console.error('Failed to update appointment:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update appointment status',
        severity: 'error'
      });
    }
  };

  const handleOpenConfirmDialog = (action: string) => {
    setConfirmDialog({ open: true, action });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, action: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    fetchAppointment();
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/appointments')}
              sx={{ mr: 2 }}
            >
              Back to Appointments
            </Button>
            <Button
              startIcon={<RefreshIcon />}
              variant="contained"
              onClick={handleRefresh}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/appointments')}
          >
            Back to Appointments
          </Button>
          
          <Box>
            <Tooltip title="Refresh appointment data">
              <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print appointment details">
              <IconButton onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Appointment Details
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {format(parseISO(appointment.appointmentDate), 'MMMM d, yyyy h:mm a')}
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={appointment.status.toUpperCase()}
              color={getStatusColor(appointment.status)}
              sx={{ fontWeight: 'bold' }}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Patient Information Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader 
              title="Patient Information" 
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <PersonIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>{appointment.patient?.name || 'Unknown Patient'}</Typography>
              
              <List dense>
                {appointment.patient?.dateOfBirth && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CalendarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date of Birth" 
                      secondary={format(parseISO(appointment.patient.dateOfBirth), 'MMM d, yyyy')} 
                    />
                  </ListItem>
                )}
                
                {appointment.patient?.gender && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Gender" secondary={appointment.patient.gender} />
                  </ListItem>
                )}
                
                {appointment.patient?.phone && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={appointment.patient.phone} />
                  </ListItem>
                )}
                
                {appointment.patient?.email && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={appointment.patient.email} />
                  </ListItem>
                )}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>Appointment Details</Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HospitalIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Clinic" 
                    secondary={appointment.clinic?.name || 'Unknown Clinic'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <MedicalIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Doctor" 
                    secondary={appointment.doctor?.name || 'Unassigned'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical Information Card */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardHeader 
              title="Medical Information" 
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  <MedicalIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Purpose of Visit</Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography>{appointment.purposeOfVisit || appointment.chiefComplaint}</Typography>
                </Paper>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Symptoms</Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography>{appointment.symptoms}</Typography>
                </Paper>
              </Box>
              
              <Divider sx={{ my: 3 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Treatment Recommendations Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title="Treatment Recommendations"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <MedicalIcon />
                </Avatar>
              }
              action={
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    aria-label="copy treatment recommendations"
                    onClick={() => handleCopyToClipboard(appointment.possibleTreatments || '', 'Treatment recommendations')}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', minHeight: 150 }}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {appointment.possibleTreatments || 'No treatment recommendations available'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Prescription Recommendations Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title="Prescription Recommendations"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <MedicationIcon />
                </Avatar>
              }
              action={
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    aria-label="copy prescription recommendations"
                    onClick={() => handleCopyToClipboard(appointment.suggestedPrescriptions || '', 'Prescription recommendations')}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', minHeight: 150 }}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {appointment.suggestedPrescriptions || 'No prescription recommendations available'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Follow-up Questions and Answers Card */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader
              title="Follow-up Questions and Answers"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  <NotesIcon />
                </Avatar>
              }
              action={
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    aria-label="copy follow-up questions and answers"
                    onClick={() => {
                      const content = appointment.followUpQuestions && appointment.followUpAnswers ? 
                        formatFollowUpContent(appointment.followUpQuestions, appointment.followUpAnswers) : 
                        'No follow-up information available';
                      handleCopyToClipboard(content, 'Follow-up questions and answers');
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', minHeight: 150 }}>
                {appointment.followUpQuestions && appointment.followUpAnswers ? (
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {formatFollowUpContent(appointment.followUpQuestions, appointment.followUpAnswers)}
                  </Typography>
                ) : (
                  <Typography>No follow-up information available</Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* Show action buttons if the appointment is in-progress and was taken in */}
            {wasTakenIn && appointment.status.toLowerCase() === 'in-progress' ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleOpenConfirmDialog('complete')}
                >
                  Finish Appointment
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => handleOpenConfirmDialog('cancel')}
                >
                  Cancel Appointment
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<BackIcon />}
                onClick={() => navigate('/appointments')}
              >
                Back to Appointments
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>
          {confirmDialog.action === 'complete' ? 'Complete Appointment' : 
           confirmDialog.action === 'in-progress' ? 'Start Appointment' : 
           'Cancel Appointment'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === 'complete' ? 
              'Are you sure you want to mark this appointment as completed?' : 
             confirmDialog.action === 'in-progress' ? 
              'Are you sure you want to mark this appointment as in progress?' : 
              'Are you sure you want to cancel this appointment?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>No</Button>
          <Button 
            onClick={() => handleStatusChange(
              confirmDialog.action === 'complete' ? 'completed' : 
              confirmDialog.action === 'in-progress' ? 'in-progress' : 
              'cancelled'
            )} 
            autoFocus
            variant="contained"
            color={
              confirmDialog.action === 'complete' ? 'success' : 
              confirmDialog.action === 'in-progress' ? 'warning' : 
              'error'
            }
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

// Function to format follow-up questions and answers into readable pairs
const formatFollowUpContent = (questions: string, answers: string): string => {
  try {
    // Try to parse as JSON first
    let questionArray: string[] = [];
    let answerArray: string[] = [];
    
    try {
      questionArray = JSON.parse(questions);
    } catch {
      // If parsing fails, fall back to splitting by newline
      questionArray = questions.split('\n').filter(line => line.trim() !== '');
    }
    
    try {
      answerArray = JSON.parse(answers);
    } catch {
      // If parsing fails, fall back to splitting by newline
      answerArray = answers.split('\n').filter(line => line.trim() !== '');
    }
    
    // Create pairs of questions and answers
    let formattedContent = '';
    
    // Handle case where we have different number of questions and answers
    const maxLength = Math.max(questionArray.length, answerArray.length);
    
    for (let i = 0; i < maxLength; i++) {
      const question = i < questionArray.length ? questionArray[i] : 'Question not available';
      const answer = i < answerArray.length ? answerArray[i] : 'Answer not available';
      
      formattedContent += `Q: ${question}\nA: ${answer}\n\n`;
    }
    
    return formattedContent.trim();
  } catch (error) {
    console.error('Error formatting follow-up content:', error);
    return 'Error displaying follow-up questions and answers';
  }
};

export default AppointmentDetail;
