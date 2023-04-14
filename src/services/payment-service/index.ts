import { Payment } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { badRequestError } from '@/errors/bad-request-error';
import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function getPaymentById(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw badRequestError();

  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  return paymentRepository.findPaymentByTicketId(ticketId);
}

const paymentService = {
  getPaymentById,
};

export default paymentService;
