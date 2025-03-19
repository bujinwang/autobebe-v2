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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { 
  doctorService,
  clinicService,
  type Doctor,
  type Clinic 
} from '../services';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    clinicIds: [] as number[],
    isActive: true
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsData, clinicsData] = await Promise.all([
          doctorService.getAllDoctors(),
          clinicService.getAllClinics()
        ]);
        
        // If admin has a default clinic, filter doctors by that clinic
        const filteredDoctors = user?.defaultClinicId 
          ? doctorsData.filter(doctor => 
              doctor.clinics.some(clinic => clinic.id === user.defaultClinicId)
            )
          : doctorsData;
          
        setDoctors(filteredDoctors);
        setClinics(clinicsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.defaultClinicId]);

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setCurrentDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        clinicIds: doctor.clinics.map(clinic => clinic.id),
        isActive: doctor.isActive
      });
    } else {
      setCurrentDoctor(null);
      setFormData({
        name: '',
        specialization: '',
        clinicIds: user?.defaultClinicId ? [user.defaultClinicId] : [],
        isActive: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<number[]>) => {
    setFormData({ ...formData, clinicIds: e.target.value as number[] });
  };

  const handleToggleActive = async (doctor: Doctor) => {
    try {
      const updatedDoctor = await doctorService.updateDoctor(doctor.id.toString(), {
        isActive: !doctor.isActive
      });
      
      setDoctors(doctors.map(d => d.id === doctor.id ? updatedDoctor : d));
      
      setSnackbar({
        open: true,
        message: `Doctor ${updatedDoctor.isActive ? 'activated' : 'deactivated'} successfully`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Failed to update doctor status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update doctor status',
        severity: 'error'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let updatedDoctor: Doctor;
      
      if (currentDoctor) {
        // Update existing doctor
        updatedDoctor = await doctorService.updateDoctor(currentDoctor.id.toString(), {
          name: formData.name,
          specialization: formData.specialization,
          clinics: formData.clinicIds.map(id => ({ 
            id, 
            name: clinics.find(c => c.id === id)?.name || '',
            address: clinics.find(c => c.id === id)?.address || '',
            phone: clinics.find(c => c.id === id)?.phone || ''
          })),
          isActive: formData.isActive
        });
        
        setDoctors(doctors.map(d => d.id === currentDoctor.id ? updatedDoctor : d));
        setSnackbar({
          open: true,
          message: 'Doctor updated successfully',
          severity: 'success'
        });
      } else {
        // Create new doctor
        updatedDoctor = await doctorService.createDoctor({
          name: formData.name,
          specialization: formData.specialization,
          clinics: formData.clinicIds.map(id => ({ 
            id, 
            name: clinics.find(c => c.id === id)?.name || '',
            address: clinics.find(c => c.id === id)?.address || '',
            phone: clinics.find(c => c.id === id)?.phone || ''
          })),
          isActive: formData.isActive
        });
        
        setDoctors([...doctors, updatedDoctor]);
        setSnackbar({
          open: true,
          message: 'Doctor created successfully',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save doctor:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save doctor information',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!currentDoctor) return;
    
    try {
      await doctorService.deleteDoctor(currentDoctor.id.toString());
      
      setDoctors(doctors.filter(d => d.id !== currentDoctor.id));
      setSnackbar({
        open: true,
        message: 'Doctor deleted successfully',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Failed to delete doctor:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete doctor',
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
          Manage Doctors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mt: 2 }}
        >
          Add New Doctor
        </Button>
      </Box>

      {doctors.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No doctors found. Add a new doctor to get started.</Typography>
        </Paper>
      ) : isMobile ? (
        // Mobile view - cards
        <Grid container spacing={2}>
          {doctors.map((doctor) => (
            <Grid item xs={12} key={doctor.id}>
              <Card sx={{ opacity: doctor.isActive ? 1 : 0.7 }}>
                <CardContent>
                  <Typography variant="h6">{doctor.name}</Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {doctor.specialization}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {doctor.clinics.map(clinic => (
                      <Chip 
                        key={clinic.id} 
                        label={clinic.name} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={doctor.isActive ? 'Active' : 'Inactive'} 
                      color={doctor.isActive ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />} 
                    onClick={() => handleOpenDialog(doctor)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color={doctor.isActive ? 'error' : 'success'}
                    startIcon={doctor.isActive ? <CloseIcon /> : <CheckIcon />}
                    onClick={() => handleToggleActive(doctor)}
                  >
                    {doctor.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDeleteDialog(doctor)}
                  >
                    Delete
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
                <TableCell>Name</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Clinics</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id} sx={{ opacity: doctor.isActive ? 1 : 0.7 }}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>
                    {doctor.clinics.map(clinic => (
                      <Chip 
                        key={clinic.id} 
                        label={clinic.name} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={doctor.isActive ? 'Active' : 'Inactive'} 
                      color={doctor.isActive ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(doctor)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color={doctor.isActive ? 'error' : 'success'} 
                      onClick={() => handleToggleActive(doctor)}
                      size="small"
                    >
                      {doctor.isActive ? <CloseIcon /> : <CheckIcon />}
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(doctor)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Doctor Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Doctor Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="specialization"
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="clinics-label">Assigned Clinics</InputLabel>
              <Select
                labelId="clinics-label"
                id="clinics"
                multiple
                value={formData.clinicIds}
                onChange={handleSelectChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map((clinicId) => {
                      const clinic = clinics.find(c => c.id === clinicId);
                      return clinic ? (
                        <Chip key={clinic.id} label={clinic.name} size="small" />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {clinics.map((clinic) => (
                  <MenuItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentDoctor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {currentDoctor?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
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

export default DoctorManagement;