import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function initializeDb() : Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        "seatNumber" INTEGER UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        "passengerName" VARCHAR(255),
        "passengerEmail" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const {rows} = await pool.query(`SELECT COUNT(*) FROM tickets;`)
    const count = parseInt(rows[0].count);

    if(count === 0){
      console.log('initialize insert 40 open seat');
      
      const values: string[] = [];
      const queryParams: any[] = [];
      let counter = 1;
      
      for (let i = 1; i <= 40; i++) {
        values.push(`($${counter}, $${counter + 1})`);
        queryParams.push(i, 'open');
        counter += 2;
      }
      
      const insertQuery = `
        INSERT INTO tickets ("seatNumber", status) 
        VALUES ${values.join(', ')};
      `;
      
      await pool.query(insertQuery, queryParams);
      console.log('all 40 seats successfully initialized');
    }
  } catch (error) {
    console.log(`Error initializing DB: ${error}`)
  }
}