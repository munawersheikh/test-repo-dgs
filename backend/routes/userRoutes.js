const express = require('express');
const { register, login, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
