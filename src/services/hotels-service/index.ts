import { Hotel } from '@prisma/client';
import ticketService from '../tickets-service';
import hotelRepository from '@/repositories/hotel-repository';
import { paymentError } from '@/errors/payment-error';
import { notFoundError } from '@/errors';
import { HotelWithRooms } from '@/protocols';

async function getHotels(userId: number): Promise<Hotel[]> {
  const userTicketIsNotValid = await validateUserTicket(userId);

  if (userTicketIsNotValid) throw paymentError();

  const hotels = await hotelRepository.findAll();

  if (!hotels.length) throw notFoundError();

  return hotels;
}

async function getHotelById(userId: number, hotelId: number): Promise<HotelWithRooms> {
  const userTicketIsNotValid = await validateUserTicket(userId);

  if (userTicketIsNotValid) throw paymentError();

  const hotel = await hotelRepository.findHotelById(hotelId);

  if (!hotel) throw notFoundError();

  return hotel;
}

export async function validateUserTicket(userId: number) {
  const ticket = await ticketService.getTickets({ userId });

  const { isRemote, includesHotel } = ticket.TicketType;

  if (ticket.status !== 'PAID' || !includesHotel || isRemote) return true;

  return false;
}

const hotelService = {
  getHotels,
  getHotelById,
};

export default hotelService;
