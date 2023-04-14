import { TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { UserTicket } from '@/services/tickets-service';

async function findAllTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findAllTickets(enrollmentId: number): Promise<UserTicket> {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function createUpdateTicket(enrollmentId: number, ticketTypeId: number, ticketId = 0) {
  return prisma.ticket.upsert({
    where: {
      id: ticketId,
    },
    create: {
      status: 'RESERVED',
      enrollmentId,
      ticketTypeId,
    },
    update: {
      status: 'PAID',
      updatedAt: new Date(),
    },
    include: {
      TicketType: true,
    },
  });
}

export default { findAllTicketTypes, findAllTickets, createUpdateTicket };
