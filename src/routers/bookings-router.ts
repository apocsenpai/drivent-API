import { Router } from 'express';
import { createBooking, getBooking, updateBooking } from '@/controllers/bookings-controller';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { roomIdSchema } from '@/schemas/rooms-schema';
import { bookingIdSchema } from '@/schemas/bookings-schemas';

const bookingRouter = Router();

bookingRouter
  .use('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(roomIdSchema), createBooking)
  .put('/:bookingId', validateParams(bookingIdSchema), validateBody(roomIdSchema), updateBooking);

export { bookingRouter };
