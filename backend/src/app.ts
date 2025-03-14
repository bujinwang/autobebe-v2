import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import medicalAIRoutes from './routes/medicalAI';
import userRoutes from './routes/userRoutes';
import clinicRoutes from './routes/clinicRoutes';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/medical-ai', medicalAIRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

// Mount routes
// Change mount path to match frontend request
app.use('/api/Clinic', clinicRoutes);

export default app;