import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  try {
    return await ticketRepository.findAllTicketTypes();
  } catch (error) {
    console.log(error);
  }
}

const ticketService = {
  getTicketTypes,
};

export default ticketService;
