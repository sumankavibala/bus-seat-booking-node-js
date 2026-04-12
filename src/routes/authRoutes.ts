import { Router } from "express";
import { register } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post('/signup', register);

export default authRoutes;
