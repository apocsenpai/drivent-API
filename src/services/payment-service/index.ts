import { Payment } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { badRequestError } from '@/errors/bad-request-error';
import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import { CreatePayment, PaymentPayload } from '@/protocols';

async function getPaymentById(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw badRequestError();

  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  return paymentRepository.findPaymentByTicketId(ticketId);
}

async function createPayment({ ticketId, cardData }: CreatePayment, userId: number) {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  const { userId: userIdResult } = ticket.Enrollment;

  if (userIdResult !== userId) throw unauthorizedError();

  const { enrollmentId, ticketTypeId } = ticket;

  await ticketRepository.createUpdateTicket(enrollmentId, ticketTypeId, ticketId);

  const { price } = ticket.TicketType;
  const cardLastDigits = cardData.number.toString().slice(-4);

  const paymentPayload: PaymentPayload = {
    ticketId,
    value: price,
    cardIssuer: cardData.issuer,
    cardLastDigits,
  };

  return await paymentRepository.createPayment(paymentPayload);
}

const paymentService = {
  getPaymentById,
  createPayment,
};

export default paymentService;
