import Joi from 'joi';

type BodyRoom = {
  roomId: number;
};

export const roomIdSchema = Joi.object<BodyRoom>({
  roomId: Joi.number().min(1).required(),
});
