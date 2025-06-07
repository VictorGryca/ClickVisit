const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/brokerController');

router.get('/:id', ctrl.profile);
router.post('/:id/edit', ctrl.edit);
router.get('/:id/visits', ctrl.visits);

module.exports = router;
