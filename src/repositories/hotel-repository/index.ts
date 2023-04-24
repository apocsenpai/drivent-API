import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findAll(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

type HotelWithRooms = Hotel & { Rooms: Room[] };

async function findHotelById(hotelId: number): Promise<HotelWithRooms> {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export default { findAll, findHotelById };
