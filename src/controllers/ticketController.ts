import { Request, Response } from "express";
import { getAllTickets, getTicketBySeat, resetAllTickets, updateTicketStatus } from "../services/ticketService";

export const getTickets = async(req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const tickets = await getAllTickets(status);
    res.status(200).json({tickets});
  } catch (error) {
    console.log(`Error getting tickets: ${error}`);
    res.status(500).json({message: 'Internal server error'});
  }
}

export const getTicketStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const ticket = await getTicketBySeat(seatNumber);

    if (!ticket) {
      res.status(404).json({ error: 'Seat not found.' });
      return;
    }

    res.status(200).json({ 
      seatNumber: ticket.seatNumber, 
      status: ticket.status 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check ticket status.' });
  }
};

export const getTicketUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const ticket = await getTicketBySeat(seatNumber);

    if (!ticket) {
      res.status(404).json({ error: 'Seat not found.' });
      return;
    }

    if (ticket.status === 'open') {
       res.status(404).json({ message: 'Seat is open. No passenger assigned.' });
       return;
    }

    res.status(200).json({
      seatNumber: ticket.seatNumber,
      passengerName: ticket.passengerName,
      passengerEmail: ticket.passengerEmail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to find passenger details.' });
  }
};


export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const seatNumber = parseInt(req.params.seatNumber as string, 10);
    const { status, passengerName, passengerEmail } = req.body;

    if (status !== 'open' && status !== 'closed') {
       res.status(400).json({ error: 'Status must be exactly "open" or "closed".' });
       return;
    }

    if (status === 'closed' && (!passengerName || !passengerEmail)) {
      res.status(400).json({ 
        error: 'Passenger Name and Email are required to reserve a ticket.' 
      });
      return;
    }

    const ticketExists = await getTicketBySeat(seatNumber);
    if (!ticketExists) {
      res.status(404).json({ error: 'Seat not found.' });
      return;
    }

    const nameToUpdate = status === 'closed' ? passengerName : null;
    const emailToUpdate = status === 'closed' ? passengerEmail : null;

    const updatedTicket = await updateTicketStatus(seatNumber, status, nameToUpdate, emailToUpdate);

    res.status(200).json({ 
      message: 'Ticket successfully structured.', 
      ticket: updatedTicket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update ticket configuration.' });
  }
};

export const resetServer = async (req: Request, res: Response): Promise<void> => {
  try {
    await resetAllTickets();
    res.status(200).json({ message: 'System Reset Done. All tickets are open now.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'System reset failed.' });
  }
};
