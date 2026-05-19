const express = require("express");
const { getClimaByCidade } = require("../controllers/climaController");

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
router.get("/:nome_cidade", getClimaByCidade);

module.exports = router;
