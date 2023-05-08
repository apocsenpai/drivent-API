import { generateCreditCardData } from '../factories';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import paymentService from '@/services/payments-service';

describe('paymentsService test suite', () => {
  describe('getPaymentById service', () => {
    it('should return a payment', async () => {
      jest.spyOn(ticketRepository, 'findTicketById').mockImplementationOnce((): any => {
        return {
          Enrollment: {
            userId: 1,
          },
        };
      });

      jest.spyOn(paymentRepository, 'findPaymentByTicketId').mockImplementationOnce((): any => {
        return {
          id: 1,
          ticketId: 1,
          value: 12212,
          cardIssuer: 'Leleu',
          cardLastDigits: '0234',
          createdAt: '2020-10-13',
          updatedAt: '2020-10-13',
        };
      });

      const ticketId = 1;
      const userId = 1;

      const result = await paymentService.getPaymentById(ticketId, userId);

      expect(result.ticketId).toBe(ticketId);
      expect(paymentRepository.findPaymentByTicketId).toBeCalled();
      expect(ticketRepository.findTicketById).toBeCalled();
    });

    it('should return BadRequestError when invalid ticketId is provided', async () => {
      const ticketId = 0;
      const userId = 1;

      const promise = paymentService.getPaymentById(ticketId, userId);

      expect(promise).rejects.toEqual({
        name: 'BadRequestError',
        message: 'Data input must be valid',
      });
    });

    it('should return notFoundError when ticket doesnt exist', async () => {
      jest.spyOn(ticketRepository, 'findTicketById').mockImplementationOnce((): any => {
        return undefined;
      });

      const ticketId = 1;
      const userId = 1;

      const promise = paymentService.getPaymentById(ticketId, userId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should return UnauthorizedError when user doesnt own given ticket', async () => {
      jest.spyOn(ticketRepository, 'findTicketById').mockImplementationOnce((): any => {
        return {
          Enrollment: {
            userId: 2,
          },
        };
      });

      const ticketId = 1;
      const userId = 1;

      const promise = paymentService.getPaymentById(ticketId, userId);

      expect(promise).rejects.toEqual({
        name: 'UnauthorizedError',
        message: 'You must be signed in to continue',
      });
    });
  });

  describe('createPayment service', () => {
    it('should return a payment', async () => {
      const cardData = generateCreditCardData();

      jest.spyOn(ticketRepository, 'findTicketById').mockImplementationOnce((): any => {
        return {
          Enrollment: {
            userId: 1,
          },
          TicketType: {
            price: 300,
          },
        };
      });

      jest.spyOn(ticketRepository, 'createUpdateTicket').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(paymentRepository, 'createPayment').mockImplementationOnce((): any => {
        return {
          id: 1,
          ticketId: 1,
          value: 12212,
          cardIssuer: cardData.issuer,
          cardLastDigits: cardData.number.toString().slice(-4),
          createdAt: '2020-10-13',
          updatedAt: '2020-10-13',
        };
      });

      const ticketId = 1;
      const userId = 1;

      const result = await paymentService.createPayment({ ticketId, cardData }, userId);

      expect(result.ticketId).toBe(ticketId);
      expect(ticketRepository.findTicketById).toBeCalled();
      expect(ticketRepository.createUpdateTicket).toBeCalled();
      expect(paymentRepository.createPayment).toBeCalled();
    });

    it('should return notFoundError when ticket doesnt exist', async () => {
      jest.spyOn(ticketRepository, 'findTicketById').mockImplementationOnce((): any => {
        return undefined;
      });

      const ticketId = 1;
      const userId = 1;

      const promise = paymentService.getPaymentById(ticketId, userId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should return UnauthorizedError when user doesnt own given ticket', async () => {
      jest.spyOn(ticketRepository, 'findTicketById').mockImplementationOnce((): any => {
        return {
          Enrollment: {
            userId: 2,
          },
        };
      });

      const ticketId = 1;
      const userId = 1;

      const promise = paymentService.getPaymentById(ticketId, userId);

      expect(promise).rejects.toEqual({
        name: 'UnauthorizedError',
        message: 'You must be signed in to continue',
      });
    });
  });
});
