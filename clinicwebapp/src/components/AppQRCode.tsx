import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

interface AppQRCodeProps {
  appName: string;
  iosUrl: string;
  androidUrl?: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

const AppQRCode: React.FC<AppQRCodeProps> = ({
  appName,
  iosUrl,
  androidUrl,
  size = 180,
  bgColor = '#FFFFFF',
  fgColor = '#000000'
}) => {
  // Use iOS URL as the primary QR code target
  const qrCodeUrl = iosUrl;

  return (
    <Box
      sx={{
        textAlign: 'center',
        bgcolor: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: 300,
        margin: 'auto'
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 1.5,
          px: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          {appName}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: bgColor,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.05)',
            mb: 2
          }}
        >
          <QRCodeSVG
            value={qrCodeUrl}
            size={size}
            level="H"
            includeMargin={true}
            bgColor={bgColor}
            fgColor={fgColor}
          />
        </Paper>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.85rem'
          }}
        >
          Scan to download on {androidUrl ? 'iOS & Android' : 'iOS'}
        </Typography>
      </Box>
    </Box>
  );
};

export default AppQRCode;
