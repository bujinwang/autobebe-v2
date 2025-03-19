import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { StaffForm } from '../components/staff/StaffForm';
import { staffService, type CreateStaffData } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function NewStaff() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (formData: { 
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "CLINIC_ADMIN" | "STAFF";
    isActive: boolean;
    clinicId: string;
    position?: string;
    specialty?: string;
    password?: string;
  }) => {
    if (!user?.defaultClinicId) return;

    setIsLoading(true);
    try {
      await staffService.createStaffMember({
        ...formData,
        clinicId: user.defaultClinicId.toString(),
        password: formData.password || '',
        position: formData.position || null,
        specialty: formData.specialty || null,
      });
      toast.success('Staff member created successfully');
      navigate('/staff');
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast.error('Failed to create staff member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4">Add New Staff Member</Typography>
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
              onSubmit={handleSubmit}
              isLoading={isLoading}
              clinicId={user.defaultClinicId.toString()}
            />
          ) : (
            <Typography color="error">
              Please select a clinic before adding staff members
            </Typography>
          )}
        </Paper>
      </Container>
    </Layout>
  );
} 