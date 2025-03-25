import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import JoyTriageLogo from '../assets/JoyTriage.webp';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSnackbar({
        open: true,
        message: 'Password reset instructions have been sent to your email.',
        severity: 'success'
      });
      setEmail('');
    } catch (error) {
      console.error('Error sending reset email:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to send reset email. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="xs">
        {/* Back to Login Link */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/login"
            color="primary"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Back to Login
          </Button>
        </Box>

        <Paper
          elevation={10}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box
              component="img"
              src={JoyTriageLogo}
              alt="JoyTriage Logo"
              sx={{ width: 100, height: 100, mb: 2, borderRadius: '50%' }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                position: 'relative',
                fontSize: '1.1rem'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Reset Email'
              )}
            </Button>
          </form>
        </Paper>

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
      </Container>
    </Box>
  );
} 