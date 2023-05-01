import { Booking, Room } from '.prisma/client';
import { prisma } from '@/config';

type RoomWithBookings = Room & {
  Booking: Booking[];
};

async function findRoomById(roomId: number): Promise<RoomWithBookings> {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

export default { findRoomById };
