const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/clientController');

router.get('/calendar/:brokerId/:propertyId', ctrl.calendar);

module.exports = router;
