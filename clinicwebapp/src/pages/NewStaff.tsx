import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { StaffForm } from '../components/StaffForm';
import { staffService, type CreateStaffData } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const NewStaff: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateStaffData) => {
    if (!user?.defaultClinicId) {
      toast.error('Please select a clinic first');
      return;
    }

    setIsLoading(true);
    try {
      await staffService.createStaffMember({
        ...data,
        clinicId: user.defaultClinicId,
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
            Add New Staff Member
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
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
};

export default NewStaff; 