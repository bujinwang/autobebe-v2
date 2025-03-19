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
  Cancel as CancelIcon,
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  Notes as NotesIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { 
  appointmentService, 
  getRecommendations,
  type Appointment 
} from '../services';
import Layout from '../components/Layout';

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  // Check if appointment was taken in
  const wasTakenIn = location.state && location.state.takenIn === true;
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '' });
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const fetchAppointment = useCallback(async () => {
    console.log('appointment id:', id);

    if (!id) return;
    
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentById(id);
      setAppointment(data);

      let possibleTreatments: string[] = [];
      let suggestedPrescriptions: string[] = [];

      try {
        if (data.possibleTreatments) {
          possibleTreatments = JSON.parse(data.possibleTreatments);
        }
      } catch (e) {
        console.error('Error parsing possibleTreatments:', e);
      }

      try {
        if (data.suggestedPrescriptions) {
          suggestedPrescriptions = JSON.parse(data.suggestedPrescriptions);
        }
      } catch (e) {
        console.error('Error parsing suggestedPrescriptions:', e);
      }

      if (!possibleTreatments.length || !suggestedPrescriptions.length) {
        fetchRecommendations(data).catch(err => {
          console.error('Background fetch recommendations failed:', err);
        });
      }
    } catch (err) {
      console.error('Failed to fetch appointment:', err);
      setError('Failed to load appointment details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRecommendations = async (appointmentData: Appointment) => {
    try {
      console.log('Fetching recommendations for appointment:', appointmentData.id);
      setLoadingRecommendations(true);
      
      let followUpQAPairs: { question: string; answer: string }[] = [];
      try {
        if (appointmentData.followUpQuestions && appointmentData.followUpAnswers) {
          const questions = JSON.parse(appointmentData.followUpQuestions);
          const answers = JSON.parse(appointmentData.followUpAnswers);
          
          followUpQAPairs = questions.map((question: string, index: number) => ({
            question,
            answer: answers[index] || ''
          }));
        }
      } catch (e) {
        console.error('Error parsing follow-up Q&A:', e);
      }
      
      const request = {
        purposeOfVisit: appointmentData.purposeOfVisit || appointmentData.chiefComplaint || '',
        symptoms: appointmentData.symptoms || '',
        followUpQAPairs
      };
      
      console.log('Sending request to medical AI:', request);
      const response = await getRecommendations(request);
      console.log('Received response from medical AI:', response);

      if (response.success) {
        console.log('Updating appointment with recommendations');
        await appointmentService.updateAppointment(appointmentData.id.toString(), {
          possibleTreatments: JSON.stringify(response.possibleTreatments),
          suggestedPrescriptions: JSON.stringify(response.suggestedPrescriptions)
        });

        setAppointment(prev => {
          if (!prev) return null;
          return {
            ...prev,
            possibleTreatments: JSON.stringify(response.possibleTreatments),
            suggestedPrescriptions: JSON.stringify(response.suggestedPrescriptions)
          };
        });

        setSnackbar({
          open: true,
          message: 'Treatment recommendations updated successfully',
          severity: 'success'
        });
      } else {
        console.error('Failed to get recommendations:', response.errorMessage);
        setSnackbar({
          open: true,
          message: response.errorMessage || 'Failed to fetch recommendations',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setSnackbar({
        open: true,
        message: 'Failed to fetch recommendations. Please try again later.',
        severity: 'error'
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

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
      await appointmentService.updateAppointment(appointment.id.toString(), { status });
      
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
                <Box>
                  {loadingRecommendations ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        aria-label="copy treatment recommendations"
                        onClick={() => {
                          try {
                            const treatments = JSON.parse(appointment.possibleTreatments || '[]');
                            const formattedContent = treatments.map((treatment: string, index: number) => 
                              `${treatment}${index < treatments.length - 1 ? ',' : ''}`
                            ).join('\n');
                            handleCopyToClipboard(formattedContent, 'Treatment recommendations');
                          } catch (e) {
                            handleCopyToClipboard('No treatment recommendations available', 'Treatment recommendations');
                          }
                        }}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              }
            />
            <CardContent>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', minHeight: 150 }}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {(() => {
                    try {
                      const treatments = JSON.parse(appointment.possibleTreatments || '[]');
                      return treatments.map((treatment: string, index: number) => 
                        `${treatment}${index < treatments.length - 1 ? ',' : ''}`
                      ).join('\n');
                    } catch (e) {
                      return 'No treatment recommendations available';
                    }
                  })()}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

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
                <Box>
                  {loadingRecommendations ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        aria-label="copy prescription recommendations"
                        onClick={() => {
                          try {
                            const prescriptions = JSON.parse(appointment.suggestedPrescriptions || '[]');
                            const formattedContent = prescriptions.map((prescription: string, index: number) => 
                              `${prescription}${index < prescriptions.length - 1 ? ',' : ''}`
                            ).join('\n');
                            handleCopyToClipboard(formattedContent, 'Prescription recommendations');
                          } catch (e) {
                            handleCopyToClipboard('No prescription recommendations available', 'Prescription recommendations');
                          }
                        }}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              }
            />
            <CardContent>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', minHeight: 150 }}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {(() => {
                    try {
                      const prescriptions = JSON.parse(appointment.suggestedPrescriptions || '[]');
                      return prescriptions.map((prescription: string, index: number) => 
                        `${prescription}${index < prescriptions.length - 1 ? ',' : ''}`
                      ).join('\n');
                    } catch (e) {
                      return 'No prescription recommendations available';
                    }
                  })()}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

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

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
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

const formatFollowUpContent = (questions: string, answers: string): string => {
  try {
    let questionArray: string[] = [];
    let answerArray: string[] = [];
    
    try {
      questionArray = JSON.parse(questions);
    } catch {
      questionArray = questions.split('\n').filter(line => line.trim() !== '');
    }
    
    try {
      answerArray = JSON.parse(answers);
    } catch {
      answerArray = answers.split('\n').filter(line => line.trim() !== '');
    }
    
    let formattedContent = '';
    
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
