import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
  createTicketTypeWithHotel,
  createHotel,
  createRoomWithHotelId,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import {
  convertDateToIsoString,
  createBooking,
  createBookingWithRoom,
  findBookingByRoomId,
} from '../factories/bookings-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body roomId is not valid', async () => {
      const token = await generateValidToken();

      const invalidRoomId = { roomId: 'lala' };

      const response = await server.post(`/booking`).send(invalidRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 when there is no enrollment for given user ', async () => {
      const token = await generateValidToken();

      const validRoomId = { roomId: 1 };

      const response = await server.post('/booking').send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const validRoomId = { roomId: 1 };

      const response = await server.post('/booking').send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const validRoomId = { roomId: 1 };

      const response = await server.post(`/booking`).send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const validRoomId = { roomId: 1 };

      const response = await server.post(`/booking`).send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const validRoomId = { roomId: 1 };

      const response = await server.post(`/booking`).send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    describe('when userTicket is valid', () => {
      it('should respond with status 404 when no room was found', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createHotel();

        const isNotExistRoom = { roomId: faker.datatype.number({ min: 1000000 }) };

        const response = await server.post(`/booking`).send(isNotExistRoom).set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('should respond with status 403 when room has no vacancies', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const hotel = await createHotel();

        const { id: roomId } = await createRoomWithHotelId(hotel.id);

        await createBooking(user.id, roomId);

        const response = await server.post(`/booking`).send({ roomId }).set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it('should respond with status 200 and return bookingId', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const hotel = await createHotel();

        const { id: roomId } = await createRoomWithHotelId(hotel.id);

        const result = await server.post(`/booking`).send({ roomId }).set('Authorization', `Bearer ${token}`);

        const { id: insertedBookingId } = await findBookingByRoomId(roomId);

        expect(result.status).toEqual(httpStatus.OK);

        expect(result.body).toEqual({ bookingId: insertedBookingId });
      });
    });
  });
});

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there is no enrollment for given user ', async () => {
      const token = await generateValidToken();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const validRoomId = { roomId: 1 };

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const validRoomId = { roomId: 1 };

      const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const validRoomId = { roomId: 1 };

      const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const validRoomId = { roomId: 1 };

      const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    describe('when userTicket is valid', () => {
      it('should respond with status 404 when no booking was found', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('should respond with status 200 and return user booking', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const hotel = await createHotel();

        const { id: roomId } = await createRoomWithHotelId(hotel.id);

        const insertedBooking = await createBookingWithRoom(user.id, roomId);

        const result = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(httpStatus.OK);

        expect(result.body).toEqual(convertDateToIsoString(insertedBooking));
      });
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when params bookingId is not valid', async () => {
      const token = await generateValidToken();

      const validRoomId = { roomId: 1 };

      const response = await server
        .put(`/booking/INAVALID_PARAMS`)
        .send(validRoomId)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body roomId is not valid', async () => {
      const token = await generateValidToken();

      const invalidRoomId = { roomId: 'lala' };

      const response = await server.put(`/booking/1`).send(invalidRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 when there is no enrollment for given user ', async () => {
      const token = await generateValidToken();

      const validRoomId = { roomId: 1 };

      const response = await server.put('/booking/1').send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const validRoomId = { roomId: 1 };

      const response = await server.put('/booking/1').send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const validRoomId = { roomId: 1 };

      const response = await server.put(`/booking/1`).send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const validRoomId = { roomId: 1 };

      const response = await server.put(`/booking/1`).send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const validRoomId = { roomId: 1 };

      const response = await server.put(`/booking/1`).send(validRoomId).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    describe('when userTicket is valid', () => {
      it('should respond with status 404 when no room was found', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createHotel();

        const isNotExistRoom = { roomId: faker.datatype.number({ min: 1000000 }) };

        const response = await server.put(`/booking/1`).send(isNotExistRoom).set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('should respond with status 403 when room has no vacancies', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const hotel = await createHotel();

        const { id: roomId } = await createRoomWithHotelId(hotel.id);

        await createBooking(user.id, roomId);

        const response = await server.put(`/booking/1`).send({ roomId }).set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it('should respond with status 200 and return bookingId', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const hotel = await createHotel();

        const { id: roomId } = await createRoomWithHotelId(hotel.id);

        const { id: insertedBookingId } = await createBooking(user.id, roomId);

        const { id: newRoomId } = await createRoomWithHotelId(hotel.id);

        const result = await server
          .put(`/booking/${insertedBookingId}`)
          .send({ roomId: newRoomId })
          .set('Authorization', `Bearer ${token}`);

        const { id: updatedBookingId } = await findBookingByRoomId(newRoomId);

        expect(result.status).toEqual(httpStatus.OK);

        expect(result.body).toEqual({ bookingId: updatedBookingId });
      });
    });
  });
});
