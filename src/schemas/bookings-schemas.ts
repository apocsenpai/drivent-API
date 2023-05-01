import Joi from 'joi';

type ParamsBookings = {
  bookingId: number;
};

export const bookingIdSchema = Joi.object<ParamsBookings>({
  bookingId: Joi.number().min(1).required(),
});
