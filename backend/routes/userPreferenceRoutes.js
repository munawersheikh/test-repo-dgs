const express = require('express');
const { createUserPreference, getUserPreferences, getUserPreferenceById, updateUserPreference, deleteUserPreference } = require('../controllers/userPreferenceController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createUserPreference);
router.get('/', auth, getUserPreferences);
router.get('/:id', auth, getUserPreferenceById);
router.put('/:id', auth, updateUserPreference);
router.delete('/:id', auth, deleteUserPreference);

module.exports = router;
