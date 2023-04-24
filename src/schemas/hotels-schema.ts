import Joi from 'joi';

type ParamsHotel = {
  hotelId: number;
};

export const hotelIdSchema = Joi.object<ParamsHotel>({
  hotelId: Joi.number().min(1).required(),
});
