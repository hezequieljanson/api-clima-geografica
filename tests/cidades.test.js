const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(30000);

describe('Endpoint /api/v1/cidades', () => {
  it('deve retornar lista de cidades para CE', async () => {
    const response = await request(app).get('/api/v1/cidades/CE?limite=5');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uf', 'CE');
    expect(response.body).toHaveProperty('quantidade_retornada', 5);
    expect(Array.isArray(response.body.cidades)).toBe(true);
    expect(response.body.cidades).toHaveLength(5);
  });

  it('deve retornar 400 para sigla UF inválida', async () => {
    const response = await request(app).get('/api/v1/cidades/ceara');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      erro: true,
      codigo: 'SIGLA_UF_INVALIDA'
    });
  });
});
