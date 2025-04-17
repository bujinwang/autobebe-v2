import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const PatientAppQRCode: React.FC = () => {
  // The URL to the AIBeautyLens App in the App Store/Play Store
  const appStoreUrl = 'https://apps.apple.com/ca/app/aibeautylens/id6743717260';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.autobebesys.aibeautylens';

  return (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: '400px',
        margin: 'auto'
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          mb: 2
        }}
      >
        Scan to Download AIBeautyLens™ with DermaGraph™
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'inline-block',
          mb: 2,
          bgcolor: 'white',
          borderRadius: 2
        }}
      >
        <QRCodeSVG
          value={appStoreUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </Paper>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mt: 1
        }}
      >
        Available on iOS and Android
      </Typography>
    </Box>
  );
};

export default PatientAppQRCode;
