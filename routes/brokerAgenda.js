const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/brokerAgendaController');

router.get('/', ctrl.index);
router.post('/add', ctrl.add);

module.exports = router;
