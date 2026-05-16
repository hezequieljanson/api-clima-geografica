const { getUfFromStateName } = require('./ibgeService');

class ServiceUnavailableError extends Error {
  constructor(service, message) {
    super(message);
    this.code = 'SERVICE_UNAVAILABLE';
    this.service = service;
  }
}

async function findCityByName(nomeCidade) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&country=BR&count=10&language=pt`;

  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (error) {
    throw new ServiceUnavailableError('OPEN_METEO_GEOCODING', error.message);
  }

  if (!response.ok) {
    throw new ServiceUnavailableError('OPEN_METEO_GEOCODING', `HTTP ${response.status}`);
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results.filter((item) => item.country_code === 'BR') : [];
  if (!results.length) {
    return null;
  }

  const normalized = nomeCidade.trim().toLowerCase();
  let city = results.find((item) => item.name.toLowerCase() === normalized);
  if (!city) {
    city = results.find((item) => item.name.toLowerCase().startsWith(normalized));
  }
  if (!city) {
    city = results[0];
  }

  const uf = await getUfFromStateName(city.admin1);

  return {
    name: city.name,
    state: city.admin1,
    uf: uf || city.admin1,
    latitude: city.latitude,
    longitude: city.longitude
  };
}

module.exports = {
  findCityByName,
  ServiceUnavailableError
};
