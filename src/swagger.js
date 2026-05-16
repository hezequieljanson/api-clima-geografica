const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Agregação Climática e Geográfica',
      version: '1.0.0',
      description: 'API REST para integração de dados climáticos e geográficos de cidades brasileiras',
      contact: {
        name: 'N703 - Técnicas de Integração de Sistemas'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local'
      }
    ],
    components: {
      schemas: {
        Cidade: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único da cidade (código IBGE)'
            },
            nome: {
              type: 'string',
              description: 'Nome da cidade'
            },
            estado: {
              type: 'string',
              description: 'Estado (sigla UF)'
            },
            latitude: {
              type: 'number',
              description: 'Latitude geográfica'
            },
            longitude: {
              type: 'number',
              description: 'Longitude geográfica'
            }
          }
        },
        Clima: {
          type: 'object',
          properties: {
            temperatura: {
              type: 'number',
              description: 'Temperatura em graus Celsius'
            },
            umidade: {
              type: 'number',
              description: 'Umidade relativa do ar em percentual'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do clima'
            },
            velocidadeVento: {
              type: 'number',
              description: 'Velocidade do vento em km/h'
            }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            erro: {
              type: 'boolean'
            },
            codigo: {
              type: 'string'
            },
            mensagem: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
