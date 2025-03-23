import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import reportWebVitals from './reportWebVitals';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
        <Box sx={{ mb: 2, color: 'error.main' }}>
          <ErrorIcon sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error.message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </Paper>
    </Container>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
