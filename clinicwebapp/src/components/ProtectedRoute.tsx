import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated, loading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;