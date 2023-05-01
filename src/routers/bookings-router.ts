import { Router } from 'express';
import { createBooking } from '@/controllers/bookings-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { roomIdSchema } from '@/schemas/rooms-schema';

const bookingRouter = Router();

bookingRouter.use('/*', authenticateToken).post('/', validateBody(roomIdSchema), createBooking);

export { bookingRouter };
