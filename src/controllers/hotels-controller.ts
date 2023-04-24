import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { JWTPayload } from '@/protocols';
import hotelService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as JWTPayload;

  try {
    const hotels = await hotelService.getHotels(userId);

    res.send(hotels);
  } catch (error) {
    next(error);
  }
}
