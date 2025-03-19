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
  Alert
} from '@mui/material';
import { StaffForm } from '../components/staff/StaffForm';
import { staffService, authService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4">Edit Staff Member</Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/staff')}
          >
            Cancel
          </Button>
        </Box>

        <Paper className="p-6 mb-4">
          {user?.defaultClinicId ? (
            <StaffForm
              initialData={staffMember}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              clinicId={user.defaultClinicId.toString()}
            />
          ) : (
            <Typography color="error">
              Please select a clinic before editing staff members
            </Typography>
          )}
        </Paper>

        {/* Password Change Section */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4">Change Password</Typography>
          {passwordError && (
            <Alert severity="error" className="mb-3">
              {passwordError}
            </Alert>
          )}
          <Box className="flex gap-4 items-start">
            <TextField
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
            >
              {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
} 