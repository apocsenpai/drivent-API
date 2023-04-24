import { Hotel } from '@prisma/client';
import ticketService from '../tickets-service';
import hotelRepository from '@/repositories/hotel-repository';
import { paymentError } from '@/errors/payment-error';
import { notFoundError } from '@/errors';
import { HotelWithRooms } from '@/protocols';

async function getHotels(userId: number): Promise<Hotel[]> {
  const ticket = await ticketService.getTickets({ userId });

  const { isRemote, includesHotel } = ticket.TicketType;

  if (ticket.status !== 'PAID' || !includesHotel || isRemote) throw paymentError();

  return await hotelRepository.findAll();
}

async function getHotelById(userId: number, hotelId: number): Promise<HotelWithRooms> {
  const ticket = await ticketService.getTickets({ userId });

  const { isRemote, includesHotel } = ticket.TicketType;

  if (ticket.status !== 'PAID' || !includesHotel || isRemote) throw paymentError();

  const hotel = await hotelRepository.findHotelById(hotelId);

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelService = {
  getHotels,
  getHotelById,
};

export default hotelService;
