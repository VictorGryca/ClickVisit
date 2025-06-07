const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/brokerAgendaController');

router.get('/', ctrl.index);
router.post('/add', ctrl.add);
// Corrija para aceitar DELETE como POST (Express não aceita DELETE em forms HTML)
router.post('/delete/:availId', ctrl.delete);

module.exports = router;
