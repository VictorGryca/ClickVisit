// routes/index.js
const express = require('express');
const router = express.Router();
const ClientsController = require('../controllers/ClientsController');

// Rotas para o CRUD de tarefas
router.post('/tarefas', ClientsController.createClient);
router.get('/tarefas', ClientsController.listClients);
router.put('/tarefas/:id', ClientsController.editClient);
router.delete('/tarefas/:id', ClientsController.deleteClient);

module.exports = router;