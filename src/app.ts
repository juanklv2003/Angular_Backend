import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);

export default app;
