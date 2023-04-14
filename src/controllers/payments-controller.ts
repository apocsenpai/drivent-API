import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { JWTPayload, TypeIdData } from '@/protocols';
import paymentService from '@/services/payment-service';

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ticketId = +req.query.ticketId;

  const { userId } = req as JWTPayload;

  try {
    const payment = await paymentService.getPaymentById(ticketId, userId);

    res.send(payment);
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
