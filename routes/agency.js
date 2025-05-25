const express = require('express');
const router = express.Router();
const controller = require('../controllers/agencyController');

const propRoutes = require('./property');
router.use('/:agencyId/properties', propRoutes);

router.get('/', controller.index);
router.post('/', controller.store);
router.post('/edit/:id', controller.update);
router.post('/delete/:id', controller.destroy);


module.exports = router;