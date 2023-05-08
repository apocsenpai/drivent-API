import enrollmentsService from '@/services/enrollments-service';
import { request } from '@/utils/request';

describe('enrollmentService test suite', () => {
  describe('getAddressFromCEP service', () => {
    it('should return a address', async () => {
      const viaCEPAddress = {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        complemento: 'lado ímpar',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107',
      };

      const result = await enrollmentsService.getAddressFromCEP({ cep: '01001000' });

      expect(result.bairro).toBe(viaCEPAddress.bairro);
      expect(result.logradouro).toBe(viaCEPAddress.logradouro);
      expect(result.complemento).toBe(viaCEPAddress.complemento);
      expect(result.cidade).toBe(viaCEPAddress.localidade);
      expect(result.uf).toBe(viaCEPAddress.uf);
    });
  });
});
