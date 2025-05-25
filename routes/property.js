const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/propertyController');

router.get('/',            ctrl.index);
router.post('/',           ctrl.store);
router.post('/edit/:id',   ctrl.update);
router.post('/delete/:id', ctrl.destroy);

module.exports = router;
