import { Router } from 'express';
import { createBooking, getBooking } from '@/controllers/bookings-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { roomIdSchema } from '@/schemas/rooms-schema';

const bookingRouter = Router();

bookingRouter.use('/*', authenticateToken).get('/', getBooking).post('/', validateBody(roomIdSchema), createBooking);

export { bookingRouter };
