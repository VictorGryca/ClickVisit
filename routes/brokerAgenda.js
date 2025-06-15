const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/brokerAgendaController');
const visitCtrl = require('../controllers/brokerVisitController'); // adicione esta linha no topo

router.get('/', ctrl.index);
router.post('/add', ctrl.add);
// Corrija para aceitar DELETE como POST (Express não aceita DELETE em forms HTML)
router.post('/delete/:availId', ctrl.delete);

// Adicione esta rota para deletar visita agendada
router.post('/visits/delete/:visitId', visitCtrl.deleteVisit);

module.exports = router;
