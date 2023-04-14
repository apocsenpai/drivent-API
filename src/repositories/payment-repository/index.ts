import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findPaymentByTicketId(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

export default { findPaymentByTicketId };
