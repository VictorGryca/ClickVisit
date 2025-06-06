const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');

const agencyRoutes = require('./agency');
router.use('/:agencyId/properties', agencyRoutes);

router.get('/', controller.index);
router.post('/', controller.store);
router.post('/edit/:id', controller.update);
router.post('/delete/:id', controller.destroy);

module.exports = router;
