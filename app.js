// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const agencyRoutes = require('./routes/agency');

const app = express();

// Engine e diretório das views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para request body
app.use(bodyParser.urlencoded({ extended: true }));  // <form method="POST">
app.use(express.json());                             // JSON (fetch / axios)

// Arquivos estáticos (CSS, img etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de domínio
app.use('/agencies', agencyRoutes);

// Redireciona raiz para listagem de agencies
app.get('/', (_, res) => res.redirect('/agencies'));

// Boot do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
