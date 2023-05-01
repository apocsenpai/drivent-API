import { prisma } from '@/config';
import { BookingWithRoom } from '@/repositories/booking-repository';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function createBookingWithRoom(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

export async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

export function convertDateToIsoString(insertedBooking: BookingWithRoom) {
  return {
    ...insertedBooking,
    createdAt: insertedBooking.createdAt.toISOString(),
    updatedAt: insertedBooking.updatedAt.toISOString(),
    Room: {
      ...insertedBooking.Room,
      createdAt: insertedBooking.Room.createdAt.toISOString(),
      updatedAt: insertedBooking.Room.updatedAt.toISOString(),
    },
  };
}
