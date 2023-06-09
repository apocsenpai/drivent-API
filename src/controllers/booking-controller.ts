import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { JWTPayload } from '@/protocols';
import bookingService from '@/services/booking-service';

type RoomIdData = {
  roomId: number;
};

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { roomId } = req.body as RoomIdData;

  const { userId } = req as JWTPayload;

  try {
    const bookingId = await bookingService.createBooking(roomId, userId);

    res.send({ bookingId });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { roomId } = req.body as RoomIdData;

  const { userId } = req as JWTPayload;

  const bookingParamsId = +req.params.bookingId;

  try {
    const bookingId = await bookingService.updateBooking(roomId, userId, bookingParamsId);

    res.send({ bookingId });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as JWTPayload;

  try {
    const booking = await bookingService.getBooking(userId);

    res.send(booking);
  } catch (error) {
    next(error);
  }
}
