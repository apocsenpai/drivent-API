import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { JWTPayload, TypeIdData } from '@/protocols';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();

    res.send(ticketTypes);
  } catch (error) {
    next(error);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as JWTPayload;

  try {
    const tickets = await ticketsService.getTickets({ userId });

    res.send(tickets);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketTypeId } = req.body as TypeIdData;

  const { userId } = req as JWTPayload;

  try {
    const ticket = await ticketsService.createTicket(ticketTypeId, userId);

    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    next(error);
  }
}
