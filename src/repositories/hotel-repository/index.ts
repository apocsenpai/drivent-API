import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelWithRooms } from '@/protocols';

async function findAll(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

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
