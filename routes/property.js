const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/propertyController');

router.get('/', ctrl.index);
router.post('/', ctrl.store);
router.post('/edit/:id', ctrl.update);
router.post('/delete/:id', ctrl.destroy);

router.get('/:propertyId', ctrl.propertyCalendar); // nova rota para tela da propriedade
router.post('/:propertyId/add-event', ctrl.addEvent); // rota para adicionar evento

router.post('/:propertyId/add-broker', ctrl.addBroker);
router.post('/:propertyId/remove-broker/:brokerId', ctrl.removeBroker);

module.exports = router;
