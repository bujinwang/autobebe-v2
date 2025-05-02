// Then import other dependencies
import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';

// Import app after environment variables are loaded and services are initialized
import app from './app';

const port = parseInt(process.env.PORT || '8080', 10);

// Log database connection
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (includes database check)
app.get('/health', async (req, res) => {
  try {
    // Perform a simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString(), db: 'connected' });
  } catch (error) {
    console.error('Health check failed - Database connection error:', error);
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString(), db: 'disconnected', error: 'Database connection failed' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Ensure server listens on all interfaces (0.0.0.0) for fly.io
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  console.log(`Server is listening on all interfaces (0.0.0.0:${port})`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
    prisma.$disconnect();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    prisma.$disconnect();
  });
});
