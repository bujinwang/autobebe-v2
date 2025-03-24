import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  Event as DateIcon,
  MedicalServices as PurposeIcon,
  LocalHospital as DoctorIcon,
  CircleOutlined as StatusIcon,
  Settings as ActionsIcon,
  Today as TodayIcon,
  Upcoming as UpcomingIcon,
  History as PastIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { appointmentService, type Appointment } from '../services';
import { useAuth } from '../contexts/AuthContext';
import NewAppointmentDialog from '../components/NewAppointmentDialog';
import { getPatientFullName } from '../utils/patientUtils';

// Helper functions to replace date-fns
const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const isFuture = (date: Date) => {
  return date > new Date();
};

const isPast = (date: Date) => {
  return date < new Date();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isToday(date)) {
    return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  return date.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Define tab values
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAppointmentDialogOpen, setNewAppointmentDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check if user has permission to create appointments
  const canCreateAppointment = !!user; // Allow any authenticated user

  const fetchAppointments = useCallback(async () => {
    try {
      if (!user?.defaultClinicId) {
        throw new Error('No clinic selected');
      }
      const appointmentsData = await appointmentService.getAppointments(user.defaultClinicId);
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setLoading(false);
    }
  }, [user?.defaultClinicId, setAppointments, setFilteredAppointments, setError, setLoading]);

  useEffect(() => {
    // Reset state when clinic changes
    setAppointments([]);
    setFilteredAppointments([]);
    setError(null);
    setLoading(true);
    
    fetchAppointments();
  }, [fetchAppointments]);

  // Filter appointments based on tab and search term
  useEffect(() => {
    if (!appointments.length) {
      setFilteredAppointments([]);
      return;
    }

    let filtered = [...appointments];
    
    // Apply tab filter
    if (tabValue === 0) { // Today
      filtered = filtered.filter(appointment => 
        isToday(new Date(appointment.appointmentDate))
      );
    } else if (tabValue === 1) { // Upcoming
      filtered = filtered.filter(appointment => 
        isFuture(new Date(appointment.appointmentDate)) && 
        !isToday(new Date(appointment.appointmentDate))
      );
    } else if (tabValue === 2) { // Past
      filtered = filtered.filter(appointment => 
        isPast(new Date(appointment.appointmentDate)) && 
        !isToday(new Date(appointment.appointmentDate))
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        (appointment.patient && getPatientFullName(appointment.patient).toLowerCase().includes(term)) ||
        (appointment.purposeOfVisit?.toLowerCase()?.includes(term)) ||
        (appointment.symptoms?.toLowerCase()?.includes(term))
      );
    }
    
    // Sort by date (most recent first for past, soonest first for today/upcoming)
    filtered = filtered.sort((a, b) => {
      if (tabValue === 2) { // Past - most recent first
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      } else { // Today/Upcoming - soonest first
        return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
      }
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, tabValue, searchTerm]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    fetchAppointments();
  };

  const handleViewDetails = (id: number) => {
    navigate(`/appointments/${id}`, { state: { source: tabValue === 0 ? 'today' : tabValue === 1 ? 'upcoming' : 'past' } });
  };

  const handleTakeIn = async (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation(); // Prevent row click event
    
    try {
      if (!user) {
        console.error('No user logged in');
        return;
      }
      
      // Update appointment status to in-progress
      await appointmentService.updateAppointment(appointment.id.toString(), { 
        status: 'in-progress',
      });
      
      // Navigate to appointment details with takenIn flag
      navigate(`/appointments/${appointment.id}`, { 
        state: { 
          source: 'today',
          takenIn: true
        } 
      });
    } catch (err) {
      console.error('Failed to take in appointment:', err);
      // Could add error handling here if needed
    }
  };

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (status.toLowerCase()) {
      case 'scheduled':
        color = 'info';
        break;
      case 'in-progress':
        color = 'warning';
        break;
      case 'completed':
        color = 'success';
        break;
      case 'cancelled':
        color = 'error';
        break;
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  const getFormattedDate = (dateString: string) => {
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography color="error" align="center">{error}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view patient appointments
          </Typography>
        </Box>
        {canCreateAppointment && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setNewAppointmentDialogOpen(true)}
          >
            New Appointment
          </Button>
        )}
      </Box>
    
      {/* Search and Filter Bar */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <TextField
          placeholder="Search patients or symptoms"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <Tooltip title="Refresh appointments">
          <IconButton onClick={handleRefresh} color="primary" size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="appointment tabs"
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ minHeight: 40 }}
        >
          <Tab 
            icon={<TodayIcon fontSize="small" />}
            iconPosition="start"
            label={isMobile ? "Today" : "Today's Appointments"} 
            sx={{ minHeight: 40 }}
          />
          <Tab 
            icon={<UpcomingIcon fontSize="small" />}
            iconPosition="start"
            label={isMobile ? "Upcoming" : "Upcoming Appointments"} 
            sx={{ minHeight: 40 }}
          />
          <Tab 
            icon={<PastIcon fontSize="small" />}
            iconPosition="start"
            label={isMobile ? "Past" : "Past Appointments"} 
            sx={{ minHeight: 40 }}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {renderAppointmentList("Today's Appointments")}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderAppointmentList("Upcoming Appointments")}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderAppointmentList("Past Appointments")}
      </TabPanel>

      {/* New Appointment Dialog */}
      {canCreateAppointment && (
        <NewAppointmentDialog
          open={newAppointmentDialogOpen}
          onClose={() => setNewAppointmentDialogOpen(false)}
          onAppointmentCreated={() => {
            fetchAppointments();
          }}
        />
      )}
    </Box>
  );

  function renderAppointmentList(title: string) {
    if (filteredAppointments.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No {title.toLowerCase()} found.</Typography>
        </Paper>
      );
    }

    return isMobile ? renderMobileView() : renderDesktopView();
  }

  function renderMobileView() {
    return (
      <Grid container spacing={2}>
        {filteredAppointments.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6">
                    {getPatientFullName(appointment.patient)}
                  </Typography>
                  {getStatusChip(appointment.status)}
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {getFormattedDate(appointment.appointmentDate)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Purpose of Visit:</strong> {appointment.purposeOfVisit || 'No purpose specified'}
                </Typography>
                {appointment.doctor && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Doctor:</strong> {appointment.doctor.name}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'space-between' }}>
                {tabValue === 0 && appointment.status.toLowerCase() === 'scheduled' && (
                  <Button 
                    size="small" 
                    variant="contained"
                    color="warning"
                    startIcon={<PlayArrowIcon fontSize="small" />}
                    onClick={(e) => handleTakeIn(e, appointment)}
                    sx={{ 
                      flexBasis: '48%', 
                      whiteSpace: 'nowrap',
                      minWidth: 'max-content' 
                    }}
                  >
                    Take In
                  </Button>
                )}
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => handleViewDetails(appointment.id)}
                  sx={{ 
                    flexBasis: tabValue === 0 && appointment.status.toLowerCase() === 'scheduled' ? '48%' : '100%',
                    whiteSpace: 'nowrap',
                    minWidth: 'max-content'
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  function renderDesktopView() {
    return (
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Date & Time
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Patient
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PurposeIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Purpose of Visit
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DoctorIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Doctor
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StatusIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Status
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <ActionsIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Actions
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow 
                key={appointment.id}
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
                onClick={() => handleViewDetails(appointment.id)}
              >
                <TableCell>{getFormattedDate(appointment.appointmentDate)}</TableCell>
                <TableCell>{getPatientFullName(appointment.patient)}</TableCell>
                <TableCell>{appointment.purposeOfVisit || 'No purpose specified'}</TableCell>
                <TableCell>{appointment.doctor?.name || 'Unassigned'}</TableCell>
                <TableCell>{getStatusChip(appointment.status)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    {tabValue === 0 && appointment.status.toLowerCase() === 'scheduled' && (
                      <Button 
                        variant="contained" 
                        color="warning"
                        size="small"
                        startIcon={<PlayArrowIcon fontSize="small" />}
                        onClick={(e) => handleTakeIn(e, appointment)}
                      >
                        Take In
                      </Button>
                    )}
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(appointment.id);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default Appointments;
