import ticketRepository from '@/repositories/ticket-repository';
import ticketService from '@/services/tickets-service';
import enrollmentRepository from '@/repositories/enrollment-repository';

describe('ticketService test suite', () => {
  describe('getTickets service', () => {
    it('should return a payment', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return {
          id: 1,
        };
      });

      jest.spyOn(ticketRepository, 'findAllTickets').mockImplementationOnce((): any => {
        return {
          enrollmentId: 1,
        };
      });

      const userId = 1;

      const result = await ticketService.getTickets({ userId });

      expect(result).toBeTruthy();
      expect(ticketRepository.findAllTickets).toBeCalled();
      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    });

    it('should return notFoundError when enrollment doesnt exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return false;
      });

      const userId = 1;

      const promise = ticketService.getTickets({ userId });

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    });

    it('should return notFoundError when ticket doesnt exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return {
          id: 3,
        };
      });

      jest.spyOn(ticketRepository, 'findAllTickets').mockImplementationOnce((): any => {
        return false;
      });

      const userId = 1;

      const promise = ticketService.getTickets({ userId });

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    });
  });

  describe('createTicket service', () => {
    it('should return a payment', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return {
          id: 1,
        };
      });

      jest.spyOn(ticketRepository, 'createUpdateTicket').mockImplementationOnce((): any => {
        return {
          enrollmentId: 1,
          ticketTypeId: 1,
        };
      });

      const userId = 1;

      const ticketTypeId = 1;

      const result = await ticketService.createTicket(ticketTypeId, userId);

      expect(result.ticketTypeId).toBe(ticketTypeId);
      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(ticketRepository.createUpdateTicket).toBeCalled();
    });

    it('should return badRequestError when ticketTypeId is not provided', async () => {
      const userId = 1;

      const invalidTicketType = 0;
      const promise = ticketService.createTicket(invalidTicketType, userId);

      expect(promise).rejects.toEqual({
        name: 'BadRequestError',
        message: 'Data input must be valid',
      });
    });

    it('should return notFoundError when enrollment doesnt exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return false;
      });

      const userId = 1;

      const ticketTypeId = 1;

      const promise = ticketService.createTicket(ticketTypeId, userId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    });
  });
});
