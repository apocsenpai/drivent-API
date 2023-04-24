import { Router } from 'express';
import { authenticateToken, validateParams } from '@/middlewares';
import { getHotelById, getHotels } from '@/controllers/hotels-controller';
import { hotelIdSchema } from '@/schemas/hotels-schema';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId', validateParams(hotelIdSchema), getHotelById);

export { hotelsRouter };
