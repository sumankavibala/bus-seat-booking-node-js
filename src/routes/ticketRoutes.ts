import { Router } from "express";
import { getTickets, getTicketStatus, getTicketUser, updateTicket, resetServer } from "../controllers/ticketController";

const authRoutes = Router();

authRoutes.get('/', getTickets);
authRoutes.get('/:seatNumber', getTicketStatus);
authRoutes.get('/:seatNumber/user', getTicketUser);
authRoutes.put('/:seatNumber', updateTicket);
authRoutes.post('/reset', resetServer);

export default authRoutes;
