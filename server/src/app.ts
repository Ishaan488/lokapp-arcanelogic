import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';

const app = express();

// ============================================
// Middleware
// ============================================
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

// Placeholder routes for future phases
// app.use('/api/reports', reportRoutes);
// app.use('/api/departments', departmentRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/analytics', analyticsRoutes);

// ============================================
// Error handling
// ============================================
app.use(errorHandler);

export default app;
