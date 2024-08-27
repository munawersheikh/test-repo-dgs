const express = require('express');
const { createUserScreen, getUserScreens, getUserScreenById, updateUserScreen, deleteUserScreen } = require('../controllers/userScreenController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createUserScreen);
router.get('/', auth, getUserScreens);
router.get('/:id', auth, getUserScreenById);
router.put('/:id', auth, updateUserScreen);
router.delete('/:id', auth, deleteUserScreen);

module.exports = router;
