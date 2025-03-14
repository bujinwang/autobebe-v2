import React, { useState, useEffect } from 'react';
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
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Appointment } from '../types';
import { appointmentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const data = await appointmentService.getAppointmentsByDate(today);
        
        // Filter appointments by clinic if user has a default clinic
        const filteredData = user?.defaultClinicId 
          ? data.filter(appointment => appointment.clinicId === user.defaultClinicId)
          : data;
          
        // Sort by appointment time (ascending)
        const sortedData = filteredData.sort((a, b) => 
          new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        );
        
        setAppointments(sortedData);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.defaultClinicId]);

  const handleViewDetails = (id: number) => {
    navigate(`/appointments/${id}`);
  };

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (status) {
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
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Today's Appointments
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {format(new Date(), 'MMMM d, yyyy')}
        </Typography>
      </Box>

      {appointments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No appointments scheduled for today.</Typography>
        </Paper>
      ) : isMobile ? (
        // Mobile view - cards
        <Grid container spacing={2}>
          {appointments.map((appointment) => (
            <Grid item xs={12} key={appointment.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {appointment.patient?.name || 'Unknown Patient'}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {format(new Date(appointment.appointmentDate), 'h:mm a')}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2">
                      Chief Complaint: {appointment.chiefComplaint}
                    </Typography>
                    {getStatusChip(appointment.status)}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => handleViewDetails(appointment.id)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop view - table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Chief Complaint</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(new Date(appointment.appointmentDate), 'h:mm a')}
                  </TableCell>
                  <TableCell>{appointment.patient?.name || 'Unknown Patient'}</TableCell>
                  <TableCell>{appointment.chiefComplaint}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleViewDetails(appointment.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
};

export default Appointments;