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
import { 
  appointmentService, 
  patientService,
  type Appointment,
  type Patient,
  staffService
} from '../services';
import { useAuth } from '../contexts/AuthContext';
import MedicalScene from '../components/MedicalScene';
import { getPatientFullName, getPatientPhone } from '../utils/patientUtils';

// Helper function to format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

// Helper function to subtract days from a date
const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

// Helper function to check if a date is today
const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Helper function to check if a date is in the future
const isFuture = (date: Date) => {
  return date.getTime() > new Date().getTime();
};

// Helper function to check if a date is in the past
const isPast = (date: Date) => {
  return date.getTime() < new Date().getTime();
};

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
    date: formatDate(date),
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

// Helper function to replace date-fns startOfMonth
const startOfMonth = (date: Date) => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Helper function to replace date-fns startOfWeek
const startOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Helper function to replace date-fns startOfYear
const startOfYear = (date: Date) => {
  const result = new Date(date);
  result.setMonth(0);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Helper function to replace date-fns subHours
const subHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(result.getHours() - hours);
  return result;
};

// Helper function to replace date-fns subMinutes
const subMinutes = (date: Date, minutes: number) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - minutes);
  return result;
};

// Helper function to replace date-fns subMonths
const subMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
};

// Helper function to replace date-fns subSeconds
const subSeconds = (date: Date, seconds: number) => {
  const result = new Date(date);
  result.setSeconds(result.getSeconds() - seconds);
  return result;
};

// Helper function to replace date-fns subWeeks
const subWeeks = (date: Date, weeks: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - (weeks * 7));
  return result;
};

// Helper function to replace date-fns subYears
const subYears = (date: Date, years: number) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() - years);
  return result;
};

// Helper function to replace date-fns addDays
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to replace date-fns addHours
const addHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

// Helper function to replace date-fns addMinutes
const addMinutes = (date: Date, minutes: number) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

// Helper function to replace date-fns addMonths
const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Helper function to replace date-fns addSeconds
const addSeconds = (date: Date, seconds: number) => {
  const result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

// Helper function to replace date-fns addWeeks
const addWeeks = (date: Date, weeks: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + (weeks * 7));
  return result;
};

// Helper function to replace date-fns addYears
const addYears = (date: Date, years: number) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// Helper function to replace date-fns endOfDay
const endOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to replace date-fns endOfMonth
const endOfMonth = (date: Date) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to replace date-fns endOfWeek
const endOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to replace date-fns endOfYear
const endOfYear = (date: Date) => {
  const result = new Date(date);
  result.setMonth(11);
  result.setDate(31);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to replace date-fns getDate
const getDate = (date: Date) => {
  return date.getDate();
};

// Helper function to replace date-fns getDaysInMonth
const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Helper function to replace date-fns getHours
const getHours = (date: Date) => {
  return date.getHours();
};

// Helper function to replace date-fns getMilliseconds
const getMilliseconds = (date: Date) => {
  return date.getMilliseconds();
};

// Helper function to replace date-fns getMinutes
const getMinutes = (date: Date) => {
  return date.getMinutes();
};

// Helper function to replace date-fns getMonth
const getMonth = (date: Date) => {
  return date.getMonth();
};

// Helper function to replace date-fns getSeconds
const getSeconds = (date: Date) => {
  return date.getSeconds();
};

// Helper function to replace date-fns getWeek
const getWeek = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Helper function to replace date-fns getYear
const getYear = (date: Date) => {
  return date.getFullYear();
};

// Helper function to replace date-fns isAfter
const isAfter = (date1: Date, date2: Date) => {
  return date1.getTime() > date2.getTime();
};

// Helper function to replace date-fns isBefore
const isBefore = (date1: Date, date2: Date) => {
  return date1.getTime() < date2.getTime();
};

// Helper function to replace date-fns isEqual
const isEqual = (date1: Date, date2: Date) => {
  return date1.getTime() === date2.getTime();
};

// Helper function to replace date-fns isSameDay
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

// Helper function to replace date-fns isSameHour
const isSameHour = (date1: Date, date2: Date) => {
  return date1.getHours() === date2.getHours() &&
         isSameDay(date1, date2);
};

// Helper function to replace date-fns isSameMonth
const isSameMonth = (date1: Date, date2: Date) => {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

// Helper function to replace date-fns isSameYear
const isSameYear = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear();
};

// Helper function to replace date-fns isValid
const isValid = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Helper function to replace date-fns isWithinInterval
const isWithinInterval = (date: Date, interval: { start: Date; end: Date }) => {
  return date.getTime() >= interval.start.getTime() && 
         date.getTime() <= interval.end.getTime();
};

// Helper function to replace date-fns parse
const parse = (dateString: string, format: string, referenceDate: Date = new Date()) => {
  // This is a simplified version - you might want to implement more complex parsing logic
  return new Date(dateString);
};

// Helper function to replace date-fns setDate
const setDate = (date: Date, day: number) => {
  const result = new Date(date);
  result.setDate(day);
  return result;
};

// Helper function to replace date-fns setHours
const setHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(hours);
  return result;
};

// Helper function to replace date-fns setMilliseconds
const setMilliseconds = (date: Date, milliseconds: number) => {
  const result = new Date(date);
  result.setMilliseconds(milliseconds);
  return result;
};

// Helper function to replace date-fns setMinutes
const setMinutes = (date: Date, minutes: number) => {
  const result = new Date(date);
  result.setMinutes(minutes);
  return result;
};

// Helper function to replace date-fns setMonth
const setMonth = (date: Date, month: number) => {
  const result = new Date(date);
  result.setMonth(month);
  return result;
};

// Helper function to replace date-fns setSeconds
const setSeconds = (date: Date, seconds: number) => {
  const result = new Date(date);
  result.setSeconds(seconds);
  return result;
};

// Helper function to replace date-fns setYear
const setYear = (date: Date, year: number) => {
  const result = new Date(date);
  result.setFullYear(year);
  return result;
};

// Helper function to replace date-fns startOfDay
const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export default function Dashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalDoctors: 0,
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
      
      if (!user?.defaultClinicId) return;

      // Check if user has admin permissions
      const isAdmin = user?.role === 'CLINIC_ADMIN' || user?.role === 'SUPER_ADMIN';
      
      // Fetch appointments and staff data which should work for all users
      const [appointmentsData, doctorsData] = await Promise.all([
        appointmentService.getAppointments(user.defaultClinicId),
        staffService.getDoctors(user.defaultClinicId)
      ]);
      
      // Try to fetch patient data only if user is admin
      let patientsData: Patient[] = [];
      if (isAdmin) {
        try {
          patientsData = await patientService.getPatientsByClinic(user.defaultClinicId);
        } catch (error) {
          console.error('Error fetching patient data:', error);
          // Continue with empty patients array for admins with errors
        }
      }

      // Calculate completion rate based on completed appointments
      const completedAppointments = appointmentsData.filter(
        (appointment) => appointment.status === 'completed'
      ).length;
      const completionRate = appointmentsData.length > 0
        ? Math.round((completedAppointments / appointmentsData.length) * 100)
        : 0;

      // Calculate today's appointments
      const today = new Date();
      const appointmentsToday = appointmentsData.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.getDate() === today.getDate() &&
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear() &&
          appointment.status.toLowerCase() === 'scheduled';
      }).length;

      setStats({
        totalPatients: patientsData.length,
        totalAppointments: appointmentsData.length,
        totalDoctors: doctorsData.length,
        newPatientsThisMonth: 0,
        appointmentsToday,
        completionRate
      });

      setRecentAppointments(
        appointmentsData
          .sort((a: Appointment, b: Appointment) => 
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
          )
          .slice(0, 5)
      );

      if (patientsData.length > 0) {
        setRecentPatients(
          patientsData
            .sort((a: Patient, b: Patient) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
        );
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values even when there's an error
      setStats({
        totalPatients: 0,
        totalAppointments: 0,
        totalDoctors: 0,
        newPatientsThisMonth: 0,
        appointmentsToday: 0,
        completionRate: 0
      });
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
          {/* Total Patients Card */}
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

          {/* Clinic Staff Card */}
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

          {/* Total Appointments Card */}
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
                          primary={getPatientFullName(appointment.patient)}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {formatDate(new Date(appointment.appointmentDate))}
                              </Typography>
                              {` — ${appointment.purposeOfVisit || 'No purpose specified'}`}
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
                            primary={
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {getPatientFullName(patient)}
                              </Typography>
                            }
                            secondary={
                              <>
                                {` — ${getPatientPhone(patient) || 'No phone'}`}
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
