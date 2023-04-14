import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'BadRequestError',
    message: 'Data input must be valid',
  };
}
