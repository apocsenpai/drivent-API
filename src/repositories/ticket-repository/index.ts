import { Ticket, TicketType } from '@prisma/client';
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

type TicketUserId = Ticket & { Enrollment: { userId: number } };

async function findTicketById(ticketId: number): Promise<TicketUserId> {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: {
        select: {
          userId: true,
        },
      },
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

export default { findAllTicketTypes, findAllTickets, findTicketById, createUpdateTicket };
