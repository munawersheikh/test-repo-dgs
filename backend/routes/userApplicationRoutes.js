const express = require('express');
const { createUserApplication, getUserApplications, getUserApplicationById, updateUserApplication, deleteUserApplication } = require('../controllers/userApplicationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createUserApplication);
router.get('/', auth, getUserApplications);
router.get('/:id', auth, getUserApplicationById);
router.put('/:id', auth, updateUserApplication);
router.delete('/:id', auth, deleteUserApplication);

module.exports = router;
