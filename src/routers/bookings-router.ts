import { Router } from 'express';
import { createBooking } from '@/controllers/bookings-controller';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use('/*', authenticateToken).post('/', createBooking);

export { bookingRouter };
