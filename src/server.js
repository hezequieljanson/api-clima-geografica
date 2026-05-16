const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API de Agregação Climática iniciada em http://localhost:${PORT}`);
});
