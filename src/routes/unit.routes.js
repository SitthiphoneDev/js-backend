const express = require('express');
const router = express.Router();
const unitController  = require('../controllers/unit.controller');

router.post('/', unitController.create);
router.get('/', unitController.getAll);
router.get('/:id', unitController.getOne);
router.put('/:id', unitController.update);
router.delete('/:id', unitController.delete);

module.exports = router;
