import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          You don't have permission to access this page
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please contact your administrator if you believe this is an error.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(user ? '/appointments' : '/login')}
          sx={{ mt: 2 }}
        >
          {user ? 'Go to Appointments' : 'Go to Login'}
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;