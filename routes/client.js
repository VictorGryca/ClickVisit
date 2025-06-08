const express = require('express');
const router = express.Router();
const clientScheduleController = require('../controllers/clientScheduleController');

router.get('/schedule/:brokerId/:propertyId', clientScheduleController.index);
router.get('/schedule/:brokerId/:propertyId/book', clientScheduleController.bookForm);
router.post('/schedule/:brokerId/:propertyId/book', clientScheduleController.bookVisit);

module.exports = router;
