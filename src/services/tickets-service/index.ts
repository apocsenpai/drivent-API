import { TicketType, Ticket } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { JWTPayload } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { badRequestError } from '@/errors/bad-request-error';
import { notFoundError } from '@/errors';

async function getTicketTypes(): Promise<TicketType[]> {
  return await ticketRepository.findAllTicketTypes();
}

export type UserTicket = Ticket & { TicketType: TicketType };

async function getTickets({ userId }: JWTPayload): Promise<UserTicket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findAllTickets(enrollment.id);

  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(ticketTypeId: number, userId: number): Promise<UserTicket> {
  if (!ticketTypeId) throw badRequestError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.createUpdateTicket(enrollment.id, ticketTypeId);

  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTickets,
  createTicket,
};

export default ticketService;
