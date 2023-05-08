import hotelService from '@/services/hotels-service';
import hotelRepository from '@/repositories/hotel-repository';
import ticketService from '@/services/tickets-service';

describe('paymentsService test suite', () => {
  describe('getHotels service', () => {
    it('should return a hotel', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(hotelRepository, 'findAll').mockImplementationOnce((): any => {
        return ['not empty array'];
      });

      const userId = 1;

      const result = await hotelService.getHotels(userId);

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(ticketService.getTickets).toBeCalled();
      expect(hotelRepository.findAll).toBeCalled();
    });

    it('should return paymentError when ticket was not paid', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'RESERVED',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      const userId = 1;

      const promise = hotelService.getHotels(userId);

      expect(promise).rejects.toEqual({
        name: 'PaymentError',
        message: 'User does not have permission yet',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return paymentError when ticketType is remote', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: true,
            includesHotel: true,
          },
        };
      });

      const userId = 1;

      const promise = hotelService.getHotels(userId);

      expect(promise).rejects.toEqual({
        name: 'PaymentError',
        message: 'User does not have permission yet',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return paymentError when ticket is not includes hotel', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: false,
          },
        };
      });

      const userId = 1;

      const promise = hotelService.getHotels(userId);

      expect(promise).rejects.toEqual({
        name: 'PaymentError',
        message: 'User does not have permission yet',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return notFoundError when no hotel found', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(hotelRepository, 'findAll').mockImplementationOnce((): any => {
        return [];
      });

      const userId = 1;

      const promise = hotelService.getHotels(userId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
      expect(ticketService.getTickets).toBeCalled();
    });
  });

  describe('getHotelById service', () => {
    it('should return a hotel', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(hotelRepository, 'findHotelById').mockImplementationOnce((): any => {
        return {
          id: 1,
        };
      });

      const userId = 1;
      const hotelId = 1;

      const result = await hotelService.getHotelById(userId, hotelId);

      expect(result.id).toBe(hotelId);
      expect(ticketService.getTickets).toBeCalled();
      expect(hotelRepository.findHotelById).toBeCalled();
    });

    it('should return paymentError when ticket was not paid', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'RESERVED',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      const userId = 1;
      const hotelId = 1;

      const promise = hotelService.getHotelById(userId, hotelId);

      expect(promise).rejects.toEqual({
        name: 'PaymentError',
        message: 'User does not have permission yet',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return paymentError when ticketType is remote', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: true,
            includesHotel: true,
          },
        };
      });

      const userId = 1;
      const hotelId = 1;

      const promise = hotelService.getHotelById(userId, hotelId);

      expect(promise).rejects.toEqual({
        name: 'PaymentError',
        message: 'User does not have permission yet',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return paymentError when ticket is not includes hotel', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: false,
          },
        };
      });

      const userId = 1;
      const hotelId = 1;

      const promise = hotelService.getHotelById(userId, hotelId);

      expect(promise).rejects.toEqual({
        name: 'PaymentError',
        message: 'User does not have permission yet',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return notFoundError when no hotel found', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(hotelRepository, 'findHotelById').mockImplementationOnce((): any => {
        return false;
      });

      const userId = 1;
      const hotelId = 1;

      const promise = hotelService.getHotelById(userId, hotelId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
      expect(ticketService.getTickets).toBeCalled();
    });
  });
});
