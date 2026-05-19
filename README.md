# API de Agregação de Dados Climáticos e Geográficos

Projeto em Node.js que expõe uma API REST para consultar informações geográficas e climáticas de cidades brasileiras.

## Estrutura do repositório

- `README.md` - documentação principal
- `INTEGRANTES.md` - dados da equipe
- `src/` - código-fonte da aplicação
- `src/routes/` - definição das rotas HTTP e documentação Swagger dos endpoints
- `src/controllers/` - handlers HTTP com delegação para os serviços
- `src/services/` - integração com serviços externos e obtenção de dados
- `src/utils/` - validações e padronização de erros
- `tests/` - testes automatizados
- `docs/postman_collection.json` - coleção Postman exportada

## Tecnologias

- Node.js
- Express
- CORS
- Swagger UI Express (Documentação interativa)
- Swagger JSDoc (Geração de documentação)
- Jest
- Supertest

## Pré-requisitos

- Node.js 18 ou superior
- NPM
- Internet ativa para consumo das APIs externas

## Instalação

```bash
npm install
```

## Executar a API

```bash
npm start
```

A API será iniciada em `http://localhost:3000`.

## 📚 Documentação Swagger

A API possui documentação interativa completa via Swagger UI. Após iniciar o servidor, acesse:

```
http://localhost:3000
```

A rota raiz redireciona automaticamente para o Swagger em `/api-docs`. Na interface Swagger você pode:

- 📖 Ver descrição detalhada de todos os endpoints
- 🔍 Consultar parâmetros obrigatórios e opcionais
- ▶️ Testar os endpoints diretamente (usando o botão "Try it out")
- 📤 Visualizar exemplos de requisições e respostas
- 🔧 Testar com diferentes valores de entrada

## Endpoints

### 1. Health Check

- `GET /api/v1/health`

Resposta de sucesso:

```json
{
  "status": "healthy",
  "versao": "1.0.0",
  "timestamp": "2025-03-15T14:30:00Z"
}
```

Resposta degradada (quando o serviço externo falha):

```json
{
  "status": "degraded",
  "versao": "1.0.0",
  "timestamp": "2025-03-15T14:30:00Z",
  "motivo": "Serviço externo indisponível"
}
```

### 2. Informações da cidade com clima

- `GET /api/v1/clima/:nome_cidade`

Parâmetros:

- `nome_cidade` (string, obrigatório): nome ou parte do nome da cidade brasileira.

Exemplo de requisição:

```bash
curl http://localhost:3000/api/v1/clima/Fortaleza
```

Resposta de sucesso:

```json
{
  "nome": "Fortaleza",
  "estado": "CE",
  "clima": {
    "temperatura_min": 24,
    "temperatura_max": 32,
    "condicao": "Parcialmente Nublado",
    "unidades": {
      "temperatura": "°C"
    }
  },
  "consultado_em": "2025-03-15T14:30:00Z"
}
```

Erros possíveis:

- `400 Bad Request` quando o nome da cidade tem menos de 2 caracteres.

```json
{
  "erro": true,
  "codigo": "NOME_INVALIDO",
  "mensagem": "O nome da cidade deve conter pelo menos 2 caracteres",
  "nome_informado": "X"
}
```

- `404 Not Found` quando nenhuma cidade for encontrada.

```json
{
  "erro": true,
  "codigo": "CIDADE_NAO_ENCONTRADA",
  "mensagem": "Nenhuma cidade encontrada com o nome informado",
  "nome_informado": "CidadeInexistente"
}
```

- `503 Service Unavailable` quando serviços externos não estiverem disponíveis.

```json
{
  "erro": true,
  "codigo": "SERVICO_EXTERNO_INDISPONIVEL",
  "mensagem": "Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes",
  "servico": "OPEN_METEO_WEATHER"
}
```

### 3. Listagem de cidades por estado

- `GET /api/v1/cidades/:sigla_uf?limite=10`

Parâmetros:

- `sigla_uf` (string, obrigatório): sigla do estado com exatamente 2 letras.
- `limite` (integer, opcional): quantidade máxima de cidades retornadas (padrão `10`, máximo `100`).

Exemplo de requisição:

```bash
curl "http://localhost:3000/api/v1/cidades/CE?limite=5"
```

Resposta de sucesso:

```json
{
  "uf": "CE",
  "quantidade_retornada": 5,
  "cidades": [
    { "nome": "Abaiara" },
    { "nome": "Acarape" },
    { "nome": "Acaraú" },
    { "nome": "Acopiara" },
    { "nome": "Aiuaba" }
  ],
  "consultado_em": "2025-03-15T14:30:00Z"
}
```

Erros possíveis:

- `400 Bad Request` quando a sigla do estado for inválida.

```json
{
  "erro": true,
  "codigo": "SIGLA_UF_INVALIDA",
  "mensagem": "A sigla do estado deve conter exatamente 2 letras",
  "sigla_uf_informada": "ceara"
}
```

- `404 Not Found` quando o estado não existir.

```json
{
  "erro": true,
  "codigo": "UF_NAO_ENCONTRADA",
  "mensagem": "Estado com a sigla informada não foi encontrado",
  "sigla_uf_informada": "XX"
}
```

## Testes automatizados

Executar a suíte de testes:

```bash
npm test
```

Os testes incluem:

- validação de retorno de clima para cidade válida
- tratamento de erro para cidade não encontrada
- retorno de lista de cidades por estado
- validação de sigla de estado inválida

## Coleção Postman

A coleção Postman está disponível em `docs/postman_collection.json`.

## Observações

- A API consome serviços externos em tempo real, por isso depende de disponibilidade de rede.
- As respostas são sempre retornadas em JSON e a aplicação está configurada para rodar na porta `3000`.
- Use as cidades de teste sugeridas na atividade para verificar a solução: Fortaleza (CE), São Paulo (SP), Rio de Janeiro (RJ), Brasília (DF), Salvador (BA), Belo Horizonte (MG), Curitiba (PR), Manaus (AM).
- A rota raiz (`/`) redireciona automaticamente para a documentação Swagger (`/api-docs`).
