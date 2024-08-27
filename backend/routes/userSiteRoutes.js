const express = require('express');
const { createUserSite, getUserSites, getUserSiteById, updateUserSite, deleteUserSite } = require('../controllers/userSiteController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createUserSite);
router.get('/', auth, getUserSites);
router.get('/:id', auth, getUserSiteById);
router.put('/:id', auth, updateUserSite);
router.delete('/:id', auth, deleteUserSite);

module.exports = router;
