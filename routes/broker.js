const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/brokerController');
const brokerVisitController = require('../controllers/brokerVisitController');

router.get('/:id', ctrl.profile);
router.post('/:id/edit', ctrl.edit);
router.get('/:id/visits', ctrl.visits);
router.get('/:id/properties', ctrl.properties);

// Adicione esta rota para deletar visita agendada
router.post('/:id/visits/delete/:visitId', brokerVisitController.deleteVisit);

module.exports = router;
