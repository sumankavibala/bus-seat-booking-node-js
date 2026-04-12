import bcryptjs from 'bcryptjs';
import { pool } from '../config/db';


export const registerUser = async(firstname: string, lastname: string, email: string, passwordString: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const passwordHash = await bcryptjs.hash(passwordString, 10);
    await pool.query(
      `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstname, lastname, email, passwordHash]
    )
    return {success: true};
  } catch (error: any) {
    if(error.code === '23505'){
      return {success: false, error: 'User already exists'};
    }
    return {success: false, error: 'Error registering user'};
  }
}