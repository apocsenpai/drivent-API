import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, getTicketTypes, getTickets } from '@/controllers/tickets-controller';
import { createTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getTickets)
  .get('/types', getTicketTypes)
  .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
