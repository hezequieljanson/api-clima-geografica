const weatherCodeMap = {
  0: 'Céu Limpo',
  1: 'Parcialmente Nublado',
  2: 'Nublado',
  3: 'Coberto',
  45: 'Neblina',
  48: 'Neblina Gelada',
  51: 'Chuvisco Leve',
  53: 'Chuvisco',
  55: 'Chuvisco Forte',
  56: 'Granizo Frio',
  57: 'Granizo Forte',
  61: 'Chuva Fraca',
  63: 'Chuva Moderada',
  65: 'Chuva Forte',
  66: 'Chuva e Granizo',
  67: 'Chuva Forte e Granizo',
  71: 'Queda de Neve',
  73: 'Neve Moderada',
  75: 'Neve Forte',
  77: 'Neve Granulada',
  80: 'Aguaceiros Fracos',
  81: 'Aguaceiros Moderados',
  82: 'Aguaceiros Fortes',
  85: 'Neve Leve',
  86: 'Neve Forte',
  95: 'Tempestade com Trovoada',
  96: 'Tempestade com Granizo',
  99: 'Tempestade Forte com Granizo'
};

class ServiceUnavailableError extends Error {
  constructor(service, message) {
    super(message);
    this.code = 'SERVICE_UNAVAILABLE';
    this.service = service;
  }
}

function formatCondition(code) {
  return weatherCodeMap[code] || 'Condição Desconhecida';
}

async function getWeatherByCoordinates(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=UTC&temperature_unit=celsius`;

  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (error) {
    throw new ServiceUnavailableError('OPEN_METEO_WEATHER', error.message);
  }

  if (!response.ok) {
    throw new ServiceUnavailableError('OPEN_METEO_WEATHER', `HTTP ${response.status}`);
  }

  const data = await response.json();
  const current = data.current_weather;

  if (!current) {
    throw new ServiceUnavailableError('OPEN_METEO_WEATHER', 'Resposta incompleta do serviço de clima');
  }

  const temperaturaMin = Array.isArray(data.daily?.temperature_2m_min) ? data.daily.temperature_2m_min[0] : current.temperature;
  const temperaturaMax = Array.isArray(data.daily?.temperature_2m_max) ? data.daily.temperature_2m_max[0] : current.temperature;

  return {
    temperatura_min: temperaturaMin,
    temperatura_max: temperaturaMax,
    condicao: formatCondition(current.weathercode),
    unidades: {
      temperatura: '°C'
    }
  };
}

module.exports = {
  getWeatherByCoordinates,
  ServiceUnavailableError
};
