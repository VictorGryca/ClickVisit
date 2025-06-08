const express = require('express');
const router = express.Router();
const clientScheduleController = require('../controllers/clientScheduleController');

router.get('/schedule/:brokerId/:propertyId', clientScheduleController.index);

module.exports = router;
