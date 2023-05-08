import bookingRepository from '@/repositories/booking-repository';
import roomRepository from '@/repositories/room-repository';
import bookingService from '@/services/booking-service';
import ticketService from '@/services/tickets-service';

describe('bookingService test suite', () => {
  describe('getBooking service', () => {
    it('should return a booking', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
        return {};
      });

      const userId = 1;

      const result = await bookingService.getBooking(userId);

      expect(result).toBeTruthy();
      expect(ticketService.getTickets).toBeCalled();
      expect(bookingRepository.findBookingByUserId).toBeCalled();
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

      const promise = bookingService.getBooking(userId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Not allowed',
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

      const promise = bookingService.getBooking(userId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Not allowed',
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

      const promise = bookingService.getBooking(userId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Not allowed',
      });
      expect(ticketService.getTickets).toBeCalled();
    });

    it('should return notFoundError when no booking found', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
        return false;
      });

      const userId = 1;

      const promise = bookingService.getBooking(userId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
      expect(ticketService.getTickets).toBeCalled();
    });
  });

  describe('createBooking service', () => {
    it('should return a bookingId', async () => {
      jest.spyOn(ticketService, 'getTickets').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
        return {
          Booking: [{}, {}],
        };
      });

      jest.spyOn(bookingRepository, 'upsertBooking').mockImplementationOnce((): any => {
        return {
          bookingId: 1,
        };
      });

      const userId = 1;
      const roomId = 1;

      const result = await bookingService.createBooking(roomId, userId);

      expect(result).toBeTruthy();
      expect(ticketService.getTickets).toBeCalled();
      expect(roomRepository.findRoomById).toBeCalled();
      expect(bookingRepository.upsertBooking).toBeCalled();
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
      const roomId = 1;

      const promise = bookingService.createBooking(roomId, userId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Not allowed',
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
      const roomId = 1;

      const promise = bookingService.createBooking(roomId, userId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Not allowed',
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
      const roomId = 1;

      const promise = bookingService.createBooking(roomId, userId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Not allowed',
      });
      expect(ticketService.getTickets).toBeCalled();
    });
  });
});
