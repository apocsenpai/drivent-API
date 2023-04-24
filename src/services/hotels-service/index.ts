import { Hotel } from '@prisma/client';
import ticketService from '../tickets-service';
import hotelRepository from '@/repositories/hotel-repository';
import { paymentError } from '@/errors/payment-error';

async function getHotels(userId: number): Promise<Hotel[]> {
  const ticket = await ticketService.getTickets({ userId });

  const { isRemote, includesHotel } = ticket.TicketType;

  if (ticket.status !== 'PAID' || !includesHotel || isRemote) throw paymentError();

  return await hotelRepository.findAll();
}

const hotelService = {
  getHotels,
};

export default hotelService;
