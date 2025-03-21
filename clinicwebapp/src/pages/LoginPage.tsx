import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import LoginAnimation from '../components/LoginAnimation';
import MedicalIcon from '@mui/icons-material/LocalHospital';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background 3D Animations */}
      <LoginAnimation />
      
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transform: 'perspective(1000px) rotateX(0deg)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              p: 2,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
              animation: 'pulse 2s infinite alternate ease-in-out',
            }}>
              <MedicalIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography 
              component="h1" 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              AutoBebe JoyTriage
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 0 5px rgba(33, 150, 243, 0.3)',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 0 5px rgba(33, 150, 243, 0.3)',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(33, 150, 243, 0.4)',
                    transform: 'translateY(-2px)',
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
              <Box sx={{ 
                textAlign: 'right',
                '& a': {
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.dark,
                  }
                }
              }}>
                <Button 
                  color="primary" 
                  href="/forgot-password"
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      background: 'transparent',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Forgot password?
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
        
        {/* Add keyframe animations */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              100% { transform: scale(1.05); }
            }
          `}
        </style>
      </Container>
    </Box>
  );
};

export default LoginPage;