const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(30000);

describe('Endpoint /api/v1/clima', () => {
  it('deve retornar dados climáticos para Fortaleza', async () => {
    const response = await request(app).get('/api/v1/clima/Fortaleza');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nome', 'Fortaleza');
    expect(response.body).toHaveProperty('estado', 'CE');
    expect(response.body).toHaveProperty('clima');
    expect(response.body.clima).toHaveProperty('temperatura_min');
    expect(response.body.clima).toHaveProperty('temperatura_max');
    expect(response.body.clima).toHaveProperty('condicao');
    expect(response.body.clima).toHaveProperty('unidades');
  });

  it('deve retornar 404 quando a cidade não for encontrada', async () => {
    const response = await request(app).get('/api/v1/clima/CidadeInexistente123');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      erro: true,
      codigo: 'CIDADE_NAO_ENCONTRADA'
    });
  });
});
