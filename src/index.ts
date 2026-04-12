import express from 'express';
import cors from 'cors';
import { initializeDb, pool } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express());

initializeDb();

process.on('SIGINT', async()=>{
  await pool.end();
  process.exit();
})

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
})