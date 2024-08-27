const express = require('express');
const { createUserNode, getUserNodes, getUserNodeById, updateUserNode, deleteUserNode } = require('../controllers/userNodeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createUserNode);
router.get('/', auth, getUserNodes);
router.get('/:id', auth, getUserNodeById);
router.put('/:id', auth, updateUserNode);
router.delete('/:id', auth, deleteUserNode);

module.exports = router;
