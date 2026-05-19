const express = require("express");
const { getCidadesByUf } = require("../controllers/cidadesController");

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
router.get("/:sigla_uf", getCidadesByUf);

module.exports = router;
