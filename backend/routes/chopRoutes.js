const express = require('express');
const { getChop } = require('../controllers/chopController');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/icc/api/chop_output/:id',  getChop);

module.exports = router;