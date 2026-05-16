const express = require('express');
const { validateCityName } = require('../utils/validators');
const { buildErrorResponse } = require('../utils/errors');
const { findCityByName } = require('../services/locationService');
const { getWeatherByCoordinates } = require('../services/weatherService');

const router = express.Router();

/**
 * @swagger
 * /api/v1/clima/{nome_cidade}:
 *   get:
 *     summary: Obter dados climáticos de uma cidade
 *     description: Retorna informações meteorológicas de uma cidade brasileira específica
 *     tags:
 *       - Clima
 *     parameters:
 *       - in: path
 *         name: nome_cidade
 *         required: true
 *         schema:
 *           type: string
 *           example: São Paulo
 *         description: Nome da cidade
 *     responses:
 *       200:
 *         description: Dados climáticos obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                   example: São Paulo
 *                 estado:
 *                   type: string
 *                   example: SP
 *                 clima:
 *                   type: object
 *                   properties:
 *                     temperatura:
 *                       type: number
 *                       example: 28.5
 *                     umidade:
 *                       type: number
 *                       example: 65
 *                     descricao:
 *                       type: string
 *                       example: Céu claro
 *                     velocidadeVento:
 *                       type: number
 *                       example: 12.5
 *                 consultado_em:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Nome de cidade inválido
 *       404:
 *         description: Cidade não encontrada
 *       503:
 *         description: Serviço externo indisponível
 */
router.get('/:nome_cidade', async (req, res, next) => {
  try {
    const nomeCidade = String(req.params.nome_cidade || '').trim();

    if (!validateCityName(nomeCidade)) {
      return res.status(400).json(buildErrorResponse({
        codigo: 'NOME_INVALIDO',
        mensagem: 'O nome da cidade deve conter pelo menos 2 caracteres',
        nome_informado: nomeCidade
      }));
    }

    const city = await findCityByName(nomeCidade);

    if (!city) {
      return res.status(404).json(buildErrorResponse({
        codigo: 'CIDADE_NAO_ENCONTRADA',
        mensagem: 'Nenhuma cidade encontrada com o nome informado',
        nome_informado: nomeCidade
      }));
    }

    const clima = await getWeatherByCoordinates(city.latitude, city.longitude);

    return res.status(200).json({
      nome: city.name,
      estado: city.uf,
      clima,
      consultado_em: new Date().toISOString()
    });
  } catch (error) {
    if (error.code === 'SERVICE_UNAVAILABLE') {
      return res.status(503).json(buildErrorResponse({
        codigo: 'SERVICO_EXTERNO_INDISPONIVEL',
        mensagem: 'Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes',
        servico: error.service
      }));
    }

    next(error);
  }
});

module.exports = router;
