import { Booking } from '.prisma/client';
import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

export default { createBooking };
