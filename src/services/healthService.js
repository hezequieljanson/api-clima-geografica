const { getCitiesByState } = require('./ibgeService');

async function getExternalHealth() {
  try {
    await Promise.race([
      getCitiesByState('SP'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
    ]);
    return { healthy: true };
  } catch (error) {
    return {
      healthy: false,
      motivo: 'Serviço externo indisponível'
    };
  }
}

module.exports = {
  getExternalHealth
};
