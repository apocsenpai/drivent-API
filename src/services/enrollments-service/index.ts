import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError, noContent } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { QueryCepData, ViaCEPAddress } from '@/protocols';

type CepAdress = Omit<ViaCEPAddress, 'localidade'> & { cidade: string };

async function getAddressFromCEP({ cep }: QueryCepData): Promise<CepAdress> {
  if (cep.length !== 8 || !cep) throw noContent();

  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (!result.data || result.data.erro) {
    throw notFoundError(); // lança um erro para quem chamou essa função!
  }

  if (result.data.erro) {
    throw noContent();
  }

  const { logradouro, complemento, bairro, localidade: cidade, uf } = result.data as ViaCEPAddress;

  return { logradouro, complemento, bairro, cidade, uf };
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw noContent();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);

  const cep = address.cep.split('-').join('');

  try {
    await getAddressFromCEP({ cep });
  } catch {
    throw invalidDataError(['invalid CEP']);
  }

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
