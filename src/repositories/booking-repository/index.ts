import { Booking, Room } from '.prisma/client';
import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

export type BookingWithRoom = Booking & { Room: Room };

async function findBookingByUserId(userId: number): Promise<BookingWithRoom> {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

export default { createBooking, findBookingByUserId };
