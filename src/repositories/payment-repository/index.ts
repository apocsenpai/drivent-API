import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentPayload } from '@/protocols';

async function findPaymentByTicketId(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(payload: PaymentPayload): Promise<Payment> {
  return prisma.payment.create({
    data: payload,
  });
}

export default { findPaymentByTicketId, createPayment };
