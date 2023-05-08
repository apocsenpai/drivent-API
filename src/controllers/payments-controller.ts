import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { CreatePayment, JWTPayload } from '@/protocols';
import paymentService from '@/services/payments-service';

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

export async function createPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId, cardData } = req.body as CreatePayment;

  const { userId } = req as JWTPayload;
  try {
    const ticket = await paymentService.createPayment({ ticketId, cardData }, userId);

    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    next(error);
  }
}
