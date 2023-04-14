import { ApplicationError } from '@/protocols';

export function typeRequestError(): ApplicationError {
  return {
    name: 'TypeRequestError',
    message: 'Ticket type must be valid',
  };
}
