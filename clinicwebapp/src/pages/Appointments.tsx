import React, { useState, useEffect } from 'react';
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
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  Event as DateIcon,
  MedicalServices as PurposeIcon,
  LocalHospital as DoctorIcon,
  CircleOutlined as StatusIcon,
  Settings as ActionsIcon,
  Today as TodayIcon,
  Upcoming as UpcomingIcon,
  History as PastIcon
} from '@mui/icons-material';
import { format, parseISO, isToday, isPast, isFuture } from 'date-fns';
import { appointmentService, type Appointment } from '../services';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

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
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Reset state when clinic changes
    setAppointments([]);
    setFilteredAppointments([]);
    setError(null);
    setLoading(true);
    
    fetchAppointments();
  }, [user?.defaultClinicId]); // Only re-fetch when the clinic ID changes

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
        isToday(parseISO(appointment.appointmentDate))
      );
    } else if (tabValue === 1) { // Upcoming
      filtered = filtered.filter(appointment => 
        isFuture(parseISO(appointment.appointmentDate)) && 
        !isToday(parseISO(appointment.appointmentDate))
      );
    } else if (tabValue === 2) { // Past
      filtered = filtered.filter(appointment => 
        isPast(parseISO(appointment.appointmentDate)) && 
        !isToday(parseISO(appointment.appointmentDate))
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        (appointment.patient?.name?.toLowerCase()?.includes(term)) ||
        (appointment.purposeOfVisit?.toLowerCase()?.includes(term)) ||
        (appointment.chiefComplaint?.toLowerCase()?.includes(term)) ||
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

  const fetchAppointments = async () => {
    try {
      if (!user?.defaultClinicId) {
        setError('No clinic selected. Please select a clinic first.');
        setLoading(false);
        return;
      }
      
      const data = await appointmentService.getAppointments(user.defaultClinicId.toString());
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

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
      
      // Create a doctor object from the current user
      const doctor = {
        id: user.id,
        name: user.name
      };
      
      // Update appointment status to in-progress and assign the current user as doctor
      await appointmentService.updateAppointment(appointment.id.toString(), { 
        status: 'in-progress',
        doctorId: user.id,
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
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy h:mm a');
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

  if (error) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Appointments
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and view patient appointments
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Tooltip title="Refresh appointments">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
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
        >
          <Tab 
            icon={<TodayIcon />}
            iconPosition="start"
            label={isMobile ? "Today" : "Today's Appointments"} 
          />
          <Tab 
            icon={<UpcomingIcon />}
            iconPosition="start"
            label={isMobile ? "Upcoming" : "Upcoming Appointments"} 
          />
          <Tab 
            icon={<PastIcon />}
            iconPosition="start"
            label={isMobile ? "Past" : "Past Appointments"} 
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
    </Layout>
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
                    {appointment.patient?.name || 'Unknown Patient'}
                  </Typography>
                  {getStatusChip(appointment.status)}
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {getFormattedDate(appointment.appointmentDate)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Purpose of Visit:</strong> {appointment.purposeOfVisit || appointment.chiefComplaint}
                </Typography>
                {appointment.doctor && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Doctor:</strong> {appointment.doctor.name}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ display: 'flex', gap: 1 }}>
                {tabValue === 0 && appointment.status.toLowerCase() === 'scheduled' && (
                  <Button 
                    size="small" 
                    variant="contained"
                    color="warning"
                    startIcon={<PlayArrowIcon />}
                    onClick={(e) => handleTakeIn(e, appointment)}
                    sx={{ flex: 1 }}
                  >
                    Take In
                  </Button>
                )}
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => handleViewDetails(appointment.id)}
                  sx={{ flex: 1 }}
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 1 }} />
                  Date & Time
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Patient
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PurposeIcon sx={{ mr: 1 }} />
                  Purpose of Visit
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DoctorIcon sx={{ mr: 1 }} />
                  Doctor
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StatusIcon sx={{ mr: 1 }} />
                  Status
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <ActionsIcon sx={{ mr: 1 }} />
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
                <TableCell>
                  {getFormattedDate(appointment.appointmentDate)}
                </TableCell>
                <TableCell>{appointment.patient?.name || 'Unknown Patient'}</TableCell>
                <TableCell>{appointment.purposeOfVisit || appointment.chiefComplaint}</TableCell>
                <TableCell>{appointment.doctor?.name || 'Unassigned'}</TableCell>
                <TableCell>{getStatusChip(appointment.status)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {tabValue === 0 && appointment.status.toLowerCase() === 'scheduled' && (
                      <Button 
                        variant="contained" 
                        color="warning"
                        size="small"
                        startIcon={<PlayArrowIcon />}
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
