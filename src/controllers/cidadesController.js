const { validateUf } = require("../utils/validators");
const { buildErrorResponse } = require("../utils/errors");
const { getCitiesByState } = require("../services/ibgeService");

async function getCidadesByUf(req, res, next) {
  try {
    const siglaUf = String(req.params.sigla_uf || "")
      .trim()
      .toUpperCase();

    if (!validateUf(siglaUf)) {
      return res.status(400).json(
        buildErrorResponse({
          codigo: "SIGLA_UF_INVALIDA",
          mensagem: "A sigla do estado deve conter exatamente 2 letras",
          sigla_uf_informada: req.params.sigla_uf,
        }),
      );
    }

    const limite = Number(req.query.limite || 10);
    const maximo =
      Number.isInteger(limite) && limite > 0 && limite <= 100 ? limite : 10;

    const cidades = await getCitiesByState(siglaUf);

    if (!cidades) {
      return res.status(404).json(
        buildErrorResponse({
          codigo: "UF_NAO_ENCONTRADA",
          mensagem: "Estado com a sigla informada não foi encontrado",
          sigla_uf_informada: siglaUf,
        }),
      );
    }

    return res.status(200).json({
      uf: siglaUf,
      quantidade_retornada: Math.min(maximo, cidades.length),
      cidades: cidades.slice(0, maximo).map((nome) => ({ nome })),
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
  getCidadesByUf,
};
