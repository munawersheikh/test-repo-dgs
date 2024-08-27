const express = require('express');
const { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication } = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createApplication);
router.get('/', auth, getApplications);
router.get('/:id', auth, getApplicationById);
router.put('/:id', auth, updateApplication);
router.delete('/:id', auth, deleteApplication);

module.exports = router;
