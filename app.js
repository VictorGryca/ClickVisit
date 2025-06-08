// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const agencyRoutes = require('./routes/agency');
const loginRoutes = require('./routes/login');
const brokerAgendaRoutes = require('./routes/brokerAgenda');
const brokerRoutes = require('./routes/broker');
const clientRoutes = require('./routes/client');
const db = require('./config/db');

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
app.use('/admin', adminRoutes);
app.use('/brokers', brokerRoutes);
app.use('/brokers/:id/agenda', brokerAgendaRoutes);
app.use('/agencies/:agencyId/properties', agencyRoutes);
app.use('/login', loginRoutes);
app.use('/client', clientRoutes);

// Redireciona raiz para tela de login
app.get('/', (req, res) => res.redirect('/login'));

// Rota de logout (simples, sem session)
app.get('/logout', (req, res) => {
  res.redirect('/login');
});

// Boot do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
