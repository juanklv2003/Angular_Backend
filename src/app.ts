import express from 'express';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// 🔥 IMPORTANTE: cargar estrategias ANTES de usarlas
import './auth/google.strategy';

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rutas
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);

export default app;
