function buildErrorResponse({ codigo, mensagem, ...extra }) {
  return {
    erro: true,
    codigo,
    mensagem,
    ...extra
  };
}

module.exports = {
  buildErrorResponse
};
