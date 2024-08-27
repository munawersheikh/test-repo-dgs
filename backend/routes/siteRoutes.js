const express = require('express');
const { createSite, getSites, getSiteById, updateSite, deleteSite } = require('../controllers/siteController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createSite);
router.get('/', auth, getSites);
router.get('/:id', auth, getSiteById);
router.put('/:id', auth, updateSite);
router.delete('/:id', auth, deleteSite);

module.exports = router;
