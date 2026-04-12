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

export const loginUser = async(email: string, passwordString: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )
    if(result.rows.length === 0){
      return {success: false, error: 'User not found'};
    }
    const user = result.rows[0];
    const isPasswordValid = await bcryptjs.compare(passwordString, user.password);
    if(!isPasswordValid){
      return {success: false, error: 'Invalid password'};
    }
    return {success: true};
  } catch (error: any) {
    return {success: false, error: 'Error authenticating user'};
  }
}