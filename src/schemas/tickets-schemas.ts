import Joi from 'joi';
import { TypeIdData } from '@/protocols';

export const createTicketSchema = Joi.object<TypeIdData>({
  ticketTypeId: Joi.number().min(1).required(),
});
