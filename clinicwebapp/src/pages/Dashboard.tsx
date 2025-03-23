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
import { 
  appointmentService, 
  patientService,
  type Appointment,
  type Patient 
} from '../services';
import { useAuth } from '../contexts/AuthContext';
import MedicalScene from '../components/MedicalScene';

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

export default function Dashboard() {
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
  const { user } = useAuth();
  
  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Only fetch all data if user is an admin
      if (user?.role === 'CLINIC_ADMIN' || user?.role === 'SUPER_ADMIN') {
        const [appointmentsData, patientsData] = await Promise.all([
          appointmentService.getAppointments(user.defaultClinicId || ''),
          patientService.getAllPatients()
        ]);
        setStats({
          totalPatients: patientsData.length,
          totalAppointments: appointmentsData.length,
          totalDoctors: 3, // Mock data - replace with actual doctor count
          newPatientsThisMonth: 0,
          appointmentsToday: 0,
          completionRate: 0
        });
        setRecentAppointments(
          appointmentsData
            .sort((a: Appointment, b: Appointment) => 
              new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
            )
            .slice(0, 5)
        );
        setRecentPatients(
          patientsData
            .sort((a: Patient, b: Patient) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
        );
      } else {
        // For staff members, only fetch appointments
        const appointmentsData = await appointmentService.getAppointments(user?.defaultClinicId || '');
        setStats({
          totalPatients: 0,
          totalAppointments: appointmentsData.length,
          totalDoctors: 3, // Mock data - replace with actual doctor count
          newPatientsThisMonth: 0,
          appointmentsToday: 0,
          completionRate: 0
        });
        setRecentAppointments(
          appointmentsData
            .sort((a: Appointment, b: Appointment) => 
              new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
            )
            .slice(0, 5)
        );
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <MedicalScene />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}
          >
            Clinic Dashboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}
          >
            Welcome back! Here's what's happening at your clinic today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Show appointments stats for all users */}
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
          
          {/* Only show patient stats for admin users */}
          {(user?.role === 'CLINIC_ADMIN' || user?.role === 'SUPER_ADMIN') && (
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
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Show staff stats for admin users */}
          {(user?.role === 'CLINIC_ADMIN' || user?.role === 'SUPER_ADMIN') && (
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
          )}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Trends (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={mockAppointmentTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <filter id="shadow" height="200%">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor={theme.palette.primary.main} floodOpacity="0.3"/>
                    </filter>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 2 }}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 2 }}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ 
                      stroke: theme.palette.primary.main,
                      strokeWidth: 2,
                      r: 6,
                      fill: theme.palette.background.paper,
                      filter: 'url(#shadow)'
                    }}
                    activeDot={{ 
                      r: 8,
                      stroke: theme.palette.primary.main,
                      strokeWidth: 3,
                      fill: theme.palette.primary.light
                    }}
                    name="Appointments"
                    filter="url(#shadow)"
                    fill="url(#lineGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={mockAppointmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string, percent: number }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {mockAppointmentStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient-${index})`}
                        stroke={theme.palette.background.paper}
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Patient Age Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mockPatientAgeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.palette.primary.light} stopOpacity={1}/>
                      <stop offset="100%" stopColor={theme.palette.primary.dark} stopOpacity={0.9}/>
                    </linearGradient>
                    <filter id="barShadow" height="150%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="2" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name"
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 2 }}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 2 }}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Patients" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    barSize={50}
                    filter="url(#barShadow)"
                  >
                    {mockPatientAgeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#barGradient)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          {/* Show appointments list for all users */}
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
          
          {/* Only show new patients list for admin users */}
          {(user?.role === 'CLINIC_ADMIN' || user?.role === 'SUPER_ADMIN') && (
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
          )}
        </Grid>
      </Box>
    </Box>
  );
}
