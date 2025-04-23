import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Home from './autobebesys/Home';
import PublicLayout from '../components/PublicLayout';
import AppQRCode from '../components/AppQRCode';

export default function LandingPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background medical visualization */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/medical-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
        zIndex: 0
      }} />

      {/* Main content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Box>

      {/* QR Codes Section */}
      <Box sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        gap: 2,
        zIndex: 1000
      }}>
        {/* JoyTriage QR Code */}
        <Paper elevation={3} sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 200
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#2C3E50', fontWeight: 500 }}>
            JoyTriage App
          </Typography>
          <AppQRCode
            appName="Download JoyTriage™ Intake Management"
            iosUrl="https://apps.apple.com/ca/app/joytriage/id6743717260"
            androidUrl="https://play.google.com/store/apps/details?id=com.autobebesys.joytriage"
            size={160}
            bgColor="#FFFFFF"
            fgColor="#2196F3"
          />
          <Typography variant="caption" sx={{ mt: 1, color: '#5D6D7E' }}>
            Available on iOS and Android
          </Typography>
        </Paper>

        {/* AIBeautyLens QR Code */}
        <Paper elevation={3} sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 200
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#2C3E50', fontWeight: 500 }}>
            AIBeautyLens App
          </Typography>
          <AppQRCode
            appName="Download AIBeautyLens™"
            iosUrl="https://apps.apple.com/app/id6744707751"
            androidUrl="https://play.google.com/store/apps/details?id=com.autobebesys.aibeautylens"
            size={160}
            bgColor="#FFFFFF"
            fgColor="#2196F3"
          />
          <Typography variant="caption" sx={{ mt: 1, color: '#5D6D7E' }}>
            Available on iOS and Android
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
} 