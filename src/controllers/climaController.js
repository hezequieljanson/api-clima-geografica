const { validateCityName } = require("../utils/validators");
const { buildErrorResponse } = require("../utils/errors");
const { findCityByName } = require("../services/locationService");
const { getWeatherByCoordinates } = require("../services/weatherService");

async function getClimaByCidade(req, res, next) {
  try {
    const nomeCidade = String(req.params.nome_cidade || "").trim();

    if (!validateCityName(nomeCidade)) {
      return res.status(400).json(
        buildErrorResponse({
          codigo: "NOME_INVALIDO",
          mensagem: "O nome da cidade deve conter pelo menos 2 caracteres",
          nome_informado: nomeCidade,
        }),
      );
    }

    const city = await findCityByName(nomeCidade);

    if (!city) {
      return res.status(404).json(
        buildErrorResponse({
          codigo: "CIDADE_NAO_ENCONTRADA",
          mensagem: "Nenhuma cidade encontrada com o nome informado",
          nome_informado: nomeCidade,
        }),
      );
    }

    const clima = await getWeatherByCoordinates(city.latitude, city.longitude);

    return res.status(200).json({
      nome: city.name,
      estado: city.uf,
      clima,
      consultado_em: new Date().toISOString(),
    });
  } catch (error) {
    if (error.code === "SERVICE_UNAVAILABLE") {
      return res.status(503).json(
        buildErrorResponse({
          codigo: "SERVICO_EXTERNO_INDISPONIVEL",
          mensagem:
            "Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes",
          servico: error.service,
        }),
      );
    }

    next(error);
  }
}

module.exports = {
  getClimaByCidade,
};
