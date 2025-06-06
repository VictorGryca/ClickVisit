// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const agencyRoutes = require('./routes/agency');
const loginRoutes = require('./routes/login');
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
// Mova esta rota para ANTES de app.use('/agencies/:agencyId/properties', agencyRoutes);
// para garantir que ela não seja "capturada" por rotas dinâmicas acima.
app.post('/brokers/:id/edit', async (req, res) => {
  const brokerId = req.params.id;
  const { name, email, phone, creci } = req.body;
  try {
    await db.query(
      'UPDATE brokers SET name = $1, email = $2, phone = $3, creci = $4 WHERE id = $5',
      [name, email, phone, creci, brokerId]
    );
    res.redirect(`/brokers/${brokerId}`);
  } catch (err) {
    res.status(500).send('Erro ao atualizar dados do corretor.');
  }
});
app.use('/agencies/:agencyId/properties', agencyRoutes);
app.use('/login', loginRoutes);

// Redireciona raiz para tela de login
app.get('/', (req, res) => res.redirect('/login'));

// Tela de informações básicas do corretor
app.get('/brokers/:id', async (req, res) => {
  const brokerId = req.params.id;
  try {
    const brokerResult = await db.query(
      'SELECT id, name, email, phone, creci FROM brokers WHERE id = $1',
      [brokerId]
    );
    const broker = brokerResult.rows[0];

    if (!broker) {
      return res.status(404).send('Corretor não encontrado.');
    }

    res.render('brokers/profile', { broker });
  } catch (err) {
    res.status(500).send('Erro ao buscar dados do corretor.');
  }
});

// Tela de visitas agendadas do corretor
app.get('/brokers/:id/visits', async (req, res) => {
  const brokerId = req.params.id;
  try {
    // Busca informações básicas do corretor (para exibir nome/cabeçalho)
    const brokerResult = await db.query(
      'SELECT id, name FROM brokers WHERE id = $1',
      [brokerId]
    );
    const broker = brokerResult.rows[0];

    if (!broker) {
      return res.status(404).send('Corretor não encontrado.');
    }

    // Busca visitas agendadas para o corretor
    const visitsResult = await db.query(
      `SELECT v.id, v.starts_at, v.ends_at, v.status, 
              p.address AS property_address, c.name AS client_name
         FROM visits v
         JOIN properties p ON v.property_id = p.id
         JOIN clients c ON v.client_id = c.id
        WHERE v.broker_id = $1
        ORDER BY v.starts_at DESC`,
      [brokerId]
    );
    const visits = visitsResult.rows;

    res.render('brokers/visits', { broker, visits });
  } catch (err) {
    res.status(500).send('Erro ao buscar visitas do corretor.');
  }
});

// Rota de logout (simples, sem session)
app.get('/logout', (req, res) => {
  // Se usar session: req.session.destroy();
  res.redirect('/login');
});

// Boot do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
