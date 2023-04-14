import Joi from 'joi';
import { CreatePayment } from '@/protocols';

const cardData = Joi.object({
  issuer: Joi.string().required(),
  number: Joi.number().min(1).required(),
  name: Joi.string().required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.number().required(),
});

export const createPaymentSchema = Joi.object<CreatePayment>({
  ticketId: Joi.number().min(1).required(),
  cardData: cardData.required(),
});
