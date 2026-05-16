const express = require('express');
const { getExternalHealth } = require('../services/healthService');

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
router.get('/', async (req, res) => {
  const health = await getExternalHealth();

  if (health.healthy) {
    return res.status(200).json({
      status: 'healthy',
      versao: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(200).json({
    status: 'degraded',
    versao: '1.0.0',
    timestamp: new Date().toISOString(),
    motivo: health.motivo
  });
});

module.exports = router;
