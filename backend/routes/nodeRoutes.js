const express = require('express');
const { createNode, getNodes, getNodeById, updateNode, deleteNode } = require('../controllers/nodeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createNode);
router.get('/', auth, getNodes);
router.get('/:id', auth, getNodeById);
router.put('/:id', auth, updateNode);
router.delete('/:id', auth, deleteNode);

module.exports = router;
