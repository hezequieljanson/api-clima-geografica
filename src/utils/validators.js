function validateCityName(nomeCidade) {
  return typeof nomeCidade === 'string' && nomeCidade.trim().length >= 2;
}

function validateUf(siglaUf) {
  return typeof siglaUf === 'string' && /^[A-Za-z]{2}$/.test(siglaUf);
}

module.exports = {
  validateCityName,
  validateUf
};
