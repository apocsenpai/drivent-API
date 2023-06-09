import { Hotel, Room } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type QueryCepData = {
  cep?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type JWTPayload = {
  userId: number;
};

export type TypeIdData = {
  ticketTypeId: number;
};

export type CreatePayment = {
  ticketId: number;
  cardData: CardData;
};

type CardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};

export type PaymentPayload = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

export type HotelWithRooms = Hotel & { Rooms: Room[] };
