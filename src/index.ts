import express from 'express';
import cors from 'cors';
import { initializeDb, pool } from './config/db';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initializeDb();

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

process.on('SIGINT', async()=>{
  await pool.end();
  process.exit();
})

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
})