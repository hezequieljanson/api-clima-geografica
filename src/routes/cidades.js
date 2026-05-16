const express = require('express');
const { validateUf } = require('../utils/validators');
const { buildErrorResponse } = require('../utils/errors');
const { getCitiesByState } = require('../services/ibgeService');

const router = express.Router();

/**
 * @swagger
 * /api/v1/cidades/{sigla_uf}:
 *   get:
 *     summary: Obter cidades por estado
 *     description: Retorna uma lista de cidades de um estado específico do Brasil
 *     tags:
 *       - Cidades
 *     parameters:
 *       - in: path
 *         name: sigla_uf
 *         required: true
 *         schema:
 *           type: string
 *           example: SP
 *         description: Sigla de dois caracteres do estado (ex. SP, RJ, MG)
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limite de cidades a retornar (máximo 100)
 *     responses:
 *       200:
 *         description: Lista de cidades obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uf:
 *                   type: string
 *                   example: SP
 *                 quantidade_retornada:
 *                   type: integer
 *                   example: 10
 *                 cidades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: São Paulo
 *                 consultado_em:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Sigla de estado inválida
 *       404:
 *         description: Estado não encontrado
 *       503:
 *         description: Serviço externo indisponível
 */
router.get('/:sigla_uf', async (req, res, next) => {
  try {
    const siglaUf = String(req.params.sigla_uf || '').trim().toUpperCase();

    if (!validateUf(siglaUf)) {
      return res.status(400).json(buildErrorResponse({
        codigo: 'SIGLA_UF_INVALIDA',
        mensagem: 'A sigla do estado deve conter exatamente 2 letras',
        sigla_uf_informada: req.params.sigla_uf
      }));
    }

    const limite = Number(req.query.limite || 10);
    const maximo = Number.isInteger(limite) && limite > 0 && limite <= 100 ? limite : 10;

    const cidades = await getCitiesByState(siglaUf);

    if (!cidades) {
      return res.status(404).json(buildErrorResponse({
        codigo: 'UF_NAO_ENCONTRADA',
        mensagem: 'Estado com a sigla informada não foi encontrado',
        sigla_uf_informada: siglaUf
      }));
    }

    return res.status(200).json({
      uf: siglaUf,
      quantidade_retornada: Math.min(maximo, cidades.length),
      cidades: cidades.slice(0, maximo).map((nome) => ({ nome })),
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
