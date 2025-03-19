import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Container } from '@mui/material';
import { StaffForm } from '../components/staff/StaffForm';
import { staffService, type StaffMember } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function EditStaff() {
  const [isLoading, setIsLoading] = useState(false);
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
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

        <Paper className="p-6">
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
      </Container>
    </Layout>
  );
} 