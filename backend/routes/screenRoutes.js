const express = require('express');
const { createScreen, getScreens, getScreenById, updateScreen, deleteScreen } = require('../controllers/screenController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createScreen);
router.get('/', auth, getScreens);
router.get('/:id', auth, getScreenById);
router.put('/:id', auth, updateScreen);
router.delete('/:id', auth, deleteScreen);

module.exports = router;
