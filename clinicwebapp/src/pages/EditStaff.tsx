import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress, 
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { StaffForm } from '../components/staff/StaffForm';
import { staffService, authService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as RoleIcon,
  Work as PositionIcon,
  LocalHospital as SpecialtyIcon,
  Key as KeyIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';

export default function EditStaff() {
  const [isLoading, setIsLoading] = useState(false);
  const [staffMember, setStaffMember] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  useEffect(() => {
    loadStaffMember();
  }, [id]);

  const loadStaffMember = async () => {
    if (!id || !user?.defaultClinicId) return;

    try {
      const data = await staffService.getStaffMembers(user.defaultClinicId.toString());
      const member = data.find(m => m.id === parseInt(id));
      if (member) {
        setStaffMember(member);
      } else {
        toast.error('Staff member not found');
        navigate('/staff');
      }
    } catch (error) {
      console.error('Error loading staff member:', error);
      toast.error('Failed to load staff member');
      navigate('/staff');
    }
  };

  const handleSubmit = async (data: any) => {
    if (!id || !user?.defaultClinicId) return;

    setIsLoading(true);
    try {
      await staffService.updateStaffMember(parseInt(id), {
        ...data,
        clinicId: user.defaultClinicId,
      });
      toast.success('Staff member updated successfully');
      navigate('/staff');
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast.error('Failed to update staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!id) return;

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setPasswordError(null);
    try {
      await authService.adminChangePassword(parseInt(id), newPassword);
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (member: any) => {
    if (!id || !user?.defaultClinicId) return;

    setIsLoading(true);
    try {
      await staffService.updateStaffMember(parseInt(id), {
        ...member,
        isActive: !member.isActive,
        clinicId: user.defaultClinicId,
      });
      toast.success('Staff member status updated successfully');
      loadStaffMember();
    } catch (error) {
      console.error('Error updating staff member status:', error);
      toast.error('Failed to update staff member status');
    } finally {
      setIsLoading(false);
    }
  };

  if (!staffMember) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/staff')}
            startIcon={<BackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Staff List
          </Button>
          <Typography variant="h4" component="h1">
            Edit Staff Member
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mb: 3 }}>
          {user?.defaultClinicId ? (
            <>
              <StaffForm
                initialData={staffMember}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                clinicId={user.defaultClinicId.toString()}
              />
              
              {/* Active Status Section */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <ActiveIcon sx={{ mr: 1, color: staffMember.isActive ? 'success.main' : 'error.main' }} />
                  Active Status
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Determine if this staff member is currently active
                </Typography>
                <Button
                  variant="outlined"
                  color={staffMember.isActive ? 'success' : 'error'}
                  onClick={() => handleToggleStatus(staffMember)}
                  startIcon={staffMember.isActive ? <ActiveIcon /> : <InactiveIcon />}
                >
                  {staffMember.isActive ? 'Active' : 'Inactive'}
                </Button>
              </Box>
            </>
          ) : (
            <Typography color="error">
              Please select a clinic before editing staff members
            </Typography>
          )}
        </Paper>

        {/* Password Change Section */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <KeyIcon sx={{ mr: 1 }} />
            Change Password
          </Typography>
          
          {passwordError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {passwordError}
            </Alert>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              disabled={isLoading || !newPassword}
              sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                height: '56px'  // Match TextField height
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'UPDATE PASSWORD'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
} 