class ServiceUnavailableError extends Error {
  constructor(service, message) {
    super(message);
    this.code = 'SERVICE_UNAVAILABLE';
    this.service = service;
  }
}

let estadoCache = null;

async function fetchEstados() {
  if (estadoCache) {
    return estadoCache;
  }

  const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (error) {
    throw new ServiceUnavailableError('IBGE_ESTADOS', error.message);
  }

  if (!response.ok) {
    throw new ServiceUnavailableError('IBGE_ESTADOS', `HTTP ${response.status}`);
  }

  estadoCache = await response.json();
  return estadoCache;
}

async function getUfFromStateName(nomeEstado) {
  if (!nomeEstado) {
    return null;
  }

  const estados = await fetchEstados();
  const normalized = nomeEstado.trim().toLowerCase();
  const match = estados.find((estado) => {
    return estado.nome.toLowerCase() === normalized || estado.sigla.toLowerCase() === normalized;
  });

  return match ? match.sigla : null;
}

async function getCitiesByState(siglaUf) {
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(siglaUf)}/municipios`;

  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (error) {
    throw new ServiceUnavailableError('IBGE_MUNICIPIOS', error.message);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ServiceUnavailableError('IBGE_MUNICIPIOS', `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.map((item) => item.nome);
}

module.exports = {
  getUfFromStateName,
  getCitiesByState,
  ServiceUnavailableError
};
