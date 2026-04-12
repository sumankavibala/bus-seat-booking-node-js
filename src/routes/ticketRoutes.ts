import { Router } from "express";
import { getTickets, getTicketStatus, getTicketUser, updateTicket, resetServer } from "../controllers/ticketController";
import { authMiddleware } from "../middleware/authMiddleware";

const ticketRoutes = Router();

ticketRoutes.get('/', authMiddleware, getTickets);
ticketRoutes.get('/:seatNumber', authMiddleware, getTicketStatus);
ticketRoutes.get('/:seatNumber/user', authMiddleware, getTicketUser);
ticketRoutes.put('/:seatNumber', authMiddleware, updateTicket);
ticketRoutes.post('/reset', authMiddleware, resetServer);

export default ticketRoutes;
