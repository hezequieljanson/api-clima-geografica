const { getExternalHealth } = require("../services/healthService");

async function getHealth(req, res) {
  const health = await getExternalHealth();

  if (health.healthy) {
    return res.status(200).json({
      status: "healthy",
      versao: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    status: "degraded",
    versao: "1.0.0",
    timestamp: new Date().toISOString(),
    motivo: health.motivo,
  });
}

module.exports = {
  getHealth,
};
