const express = require("express");
const { getHealth } = require("../controllers/healthController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Verificar saúde da API
 *     description: Verifica se a API e seus serviços externos estão funcionando
 *     tags:
 *       - Saúde
 *     responses:
 *       200:
 *         description: Status de saúde da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, degraded]
 *                   example: healthy
 *                 versao:
 *                   type: string
 *                   example: 1.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 motivo:
 *                   type: string
 *                   example: Serviço de clima indisponível
 */
router.get("/", getHealth);

module.exports = router;
