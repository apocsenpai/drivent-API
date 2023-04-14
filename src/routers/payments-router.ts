import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment, getPaymentByTicketId } from '@/controllers/payments-controller';
import { createPaymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentByTicketId)
  .post('/process', validateBody(createPaymentSchema), createPayment);

export { paymentsRouter };
