import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);
app.use('/auth', authRoutes);

export default app;
