const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/propertyController');

// As rotas já assumem que o prefixo é /agencies/:agencyId/properties
router.get('/', ctrl.index);
router.post('/', ctrl.store);
router.post('/edit/:id', ctrl.update);
router.post('/delete/:id', ctrl.destroy);

// Novas rotas para agenda da propriedade
router.get('/:propertyId', ctrl.propertyCalendar);
router.post('/:propertyId/add-event', async (req, res, next) => {
  try {
    // Inclui o campo day no corpo para o model
    req.body.property_id = req.params.propertyId;
    req.body.day = req.body.day;
    await ctrl.addEvent(req, res, next);
  } catch (err) {
    next(err);
  }
});
router.post('/:propertyId/delete-event/:eventId', ctrl.deleteEvent);

router.post('/:propertyId/add-broker', ctrl.addBroker);
router.post('/:propertyId/remove-broker/:brokerId', ctrl.removeBroker);

module.exports = router;