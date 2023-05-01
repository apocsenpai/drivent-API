import { validateUserTicket } from '../hotels-service';
import roomRepository from '@/repositories/room-repository';
import { forbiddenError } from '@/errors/forbidden-error';
import { notFoundError } from '@/errors';
import bookingRepository, { BookingWithRoom } from '@/repositories/booking-repository';

async function createBooking(roomId: number, userId: number) {
  const userTicketIsNotValid = await validateUserTicket(userId);

  if (userTicketIsNotValid) throw forbiddenError();

  const room = await roomRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  const { Booking } = room;

  if (Booking.length) throw forbiddenError();

  const { id: bookingId } = await bookingRepository.createBooking(room.id, userId);

  return bookingId;
}

async function getBooking(userId: number): Promise<BookingWithRoom> {
  const userTicketIsNotValid = await validateUserTicket(userId);

  if (userTicketIsNotValid) throw forbiddenError();

  const booking = bookingRepository.findBookingByUserId(userId);

  if (!booking) throw notFoundError();

  return booking;
}

const bookingService = {
  createBooking,
  getBooking,
};

export default bookingService;
