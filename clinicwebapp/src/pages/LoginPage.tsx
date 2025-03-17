import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Container, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
// Update this import to use the service from index.ts
import { authService } from '../services/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Log the attempt for debugging
      console.log('Attempting login with:', { email });
      
      // Use the authService from index.ts
      const responseData = await authService.login(email, password);
      
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>AutoBebe Clinic Login</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <button 
        onClick={handleSubmit}
        style={{ 
          backgroundColor: '#0066cc', 
          color: 'white', 
          padding: '10px 15px', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        SIGN IN
      </button>
      
      <div style={{ marginTop: '15px', textAlign: 'right' }}>
        <a href="/forgot-password">Forgot password?</a>
      </div>
    </div>
  );
};

export default LoginPage;