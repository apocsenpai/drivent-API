import { Booking, Room } from '.prisma/client';
import { prisma } from '@/config';

async function upsertBooking(roomId: number, userId: number, bookingId = 0): Promise<Booking> {
  return prisma.booking.upsert({
    where: {
      id: bookingId,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
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

export default { upsertBooking, findBookingByUserId };
