import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  PeopleAlt as PatientsIcon,
  MedicalServices as AppointmentsIcon,
  LocalHospital as DoctorsIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  Person as PersonIcon,
  ArrowUpward as ArrowUpwardIcon,
  // Remove the unused import:
  // ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import Layout from '../components/Layout';
import { appointmentService } from '../services/api';
import patientService from '../services/api/patientService';
import { Appointment, Patient } from '../types';

// Mock data for charts - replace with real API calls
const mockAppointmentStatusData = [
  { name: 'Completed', value: 45 },
  { name: 'Scheduled', value: 30 },
  { name: 'Cancelled', value: 15 },
  { name: 'No-show', value: 10 }
];

const mockAppointmentTrendData = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(new Date(), 6 - i);
  return {
    date: format(date, 'MMM dd'),
    appointments: Math.floor(Math.random() * 10) + 5
  };
});

const mockPatientAgeData = [
  { name: '0-18', value: 25 },
  { name: '19-35', value: 40 },
  { name: '36-50', value: 20 },
  { name: '51-65', value: 10 },
  { name: '65+', value: 5 }
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalDoctors: 3,
    newPatientsThisMonth: 0,
    appointmentsToday: 0,
    completionRate: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  
  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch appointments data
        const appointments = await appointmentService.getAllAppointments();
        
        // Fetch patients data
        const patients = await patientService.getAllPatients();
        
        // Calculate statistics
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const appointmentsToday = appointments.filter((app: Appointment) => 
          format(parseISO(app.appointmentDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        
        const completedAppointments = appointments.filter((app: Appointment) => app.status === 'completed');
        const completionRate = appointments.length > 0 
          ? Math.round((completedAppointments.length / appointments.length) * 100) 
          : 0;
        
        const newPatientsThisMonth = patients.filter((patient: Patient) => 
          new Date(patient.createdAt) >= firstDayOfMonth
        );
        
        setStats({
          totalPatients: patients.length,
          totalAppointments: appointments.length,
          totalDoctors: 3, // Mock data - replace with actual doctor count
          newPatientsThisMonth: newPatientsThisMonth.length,
          appointmentsToday: appointmentsToday.length,
          completionRate
        });
        
        // Set recent appointments and patients
        setRecentAppointments(
          appointments
            .sort((a: Appointment, b: Appointment) => 
              new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
            )
            .slice(0, 5)
        );
        
        setRecentPatients(
          patients
            .sort((a: Patient, b: Patient) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
        );
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Clinic Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back! Here's what's happening at your clinic today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PatientsIcon />
                </Avatar>
                <Typography variant="h6">Total Patients</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {stats.totalPatients}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpwardIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  {stats.newPatientsThisMonth} new this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <AppointmentsIcon />
                </Avatar>
                <Typography variant="h6">Total Appointments</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {stats.totalAppointments}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon fontSize="small" color="info" />
                <Typography variant="body2" color="info.main" sx={{ ml: 0.5 }}>
                  {stats.appointmentsToday} scheduled today
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <DoctorsIcon />
                </Avatar>
                <Typography variant="h6">Clinic Staff</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {stats.totalDoctors}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  {stats.completionRate}% completion rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Appointment Trends (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={mockAppointmentTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke={theme.palette.primary.main} 
                  activeDot={{ r: 8 }} 
                  name="Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Appointment Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAppointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string, percent: number }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockAppointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Age Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockPatientAgeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Patients" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Appointments" />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.patient?.name || 'Unknown Patient'}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {format(new Date(appointment.appointmentDate), 'MMM d, yyyy h:mm a')}
                            </Typography>
                            {` — ${appointment.purposeOfVisit || appointment.chiefComplaint || 'No purpose specified'}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentAppointments.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent appointments" />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="New Patients" />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {recentPatients.length > 0 ? (
                recentPatients.map((patient, index) => (
                  <React.Fragment key={patient.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={patient.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {patient.email}
                            </Typography>
                            {` — ${patient.phone || 'No phone'}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentPatients.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No new patients" />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;

// Remove these unused imports:
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';