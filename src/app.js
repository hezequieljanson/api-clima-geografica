const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const climaRouter = require('./routes/clima');
const cidadesRouter = require('./routes/cidades');
const healthRouter = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz - Redireciona para Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/v1/clima', climaRouter);
app.use('/api/v1/cidades', cidadesRouter);
app.use('/api/v1/health', healthRouter);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    erro: true,
    codigo: 'INTERNAL_ERROR',
    mensagem: 'Erro interno no servidor. Tente novamente mais tarde.'
  });
});

module.exports = app;
