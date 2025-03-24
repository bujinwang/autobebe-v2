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
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { StaffForm } from '../components/StaffForm';
import staffService, { StaffMember, UpdateStaffData } from '../services/staffService';
import { authService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import {
  Key as KeyIcon,
  ArrowBack as BackIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

/* eslint-disable react-hooks/exhaustive-deps */

const EditStaff: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffMember = async () => {
      if (!id || !user?.defaultClinicId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await staffService.getStaffMembers(user.defaultClinicId.toString());
        const member = data.find((m: StaffMember) => m.id === parseInt(id));
        if (member) {
          setStaffMember(member);
        } else {
          setError('Staff member not found');
        }
      } catch (err) {
        setError('Failed to fetch staff member');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffMember();
  }, [id, user?.defaultClinicId]);

  const handleSubmit = async (data: UpdateStaffData) => {
    if (!id || !user?.defaultClinicId) return;

    setIsLoading(true);
    setError(null);

    try {
      await staffService.updateStaffMember(parseInt(id), {
        ...data,
        clinicId: user.defaultClinicId,
      });
      navigate('/staff');
    } catch (err) {
      setError('Failed to update staff member');
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

  const handleToggleStatus = async () => {
    if (!id || !user?.defaultClinicId || !staffMember) return;

    setIsLoading(true);
    setError(null);

    try {
      await staffService.updateStaffMember(parseInt(id), {
        ...staffMember,
        isActive: !staffMember.isActive,
        clinicId: user.defaultClinicId,
      });
      navigate('/staff');
    } catch (err) {
      setError('Failed to update staff status');
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
                  onClick={handleToggleStatus}
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
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
};

export default EditStaff; 