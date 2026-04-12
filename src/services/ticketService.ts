import {pool} from '../config/db';

export const getAllTickets = async (status?: string): Promise<any[]> => {
  if (status === 'open' || status === 'closed') {
    const result = await pool.query('SELECT * FROM tickets WHERE status = $1 ORDER BY "seatNumber" ASC;', [status]);
    return result.rows;
  }
  const result = await pool.query('SELECT * FROM tickets ORDER BY "seatNumber" ASC;');
  return result.rows;
};

export const getTicketBySeat = async (seatNumber: number): Promise<any> => {
  const result = await pool.query('SELECT * FROM tickets WHERE "seatNumber" = $1;', [seatNumber]);
  return result.rows.length ? result.rows[0] : null;
};

export const updateTicketStatus = async (seatNumber: number, status: string, passengerName: string | null, passengerEmail: string | null): Promise<any> => {
  const updateResult = await pool.query(
    `
      UPDATE tickets 
      SET status = $1, "passengerName" = $2, "passengerEmail" = $3, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "seatNumber" = $4
      RETURNING *;
    `, 
    [status, passengerName, passengerEmail, seatNumber]
  );
  return updateResult.rows[0];
};

export const resetAllTickets = async (): Promise<void> => {
  await pool.query(
    `
      UPDATE tickets 
      SET status = $1, "passengerName" = NULL, "passengerEmail" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
    `,
    ['open']
  );
};