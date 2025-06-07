const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/propertyController');

// As rotas já assumem que o prefixo é /agencies/:agencyId/properties
router.get('/', ctrl.index);
router.post('/', ctrl.store);
router.post('/edit/:id', ctrl.update);
router.post('/delete/:id', ctrl.destroy);

module.exports = router;