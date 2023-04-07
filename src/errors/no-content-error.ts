import { ApplicationError } from '@/protocols';

export function noContent(): ApplicationError {
  return {
    name: 'NoContent',
    message: 'No content was found',
  };
}
