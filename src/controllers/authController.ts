import { Request, Response } from "express";
import { registerUser } from "../services/authService";


export const register = async(req: Request, res: Response): Promise<void> => {
  try {
    const {firstname, lastname, email, password} = req.body;
    
    if(!firstname || !lastname || !email || !password){
      res.status(400).json({message: 'All fields are required'});
      return;
    }

    const {success, error} = await registerUser(firstname, lastname, email, password);

    if(!success){
      res.status(400).json({message: error});
      return;
    }

    res.status(201).json({message: 'User registered successfully'});
  } catch (error) {
    console.log(`Error registering user: ${error}`);
    res.status(500).json({message: 'Internal server error'});
  }
}