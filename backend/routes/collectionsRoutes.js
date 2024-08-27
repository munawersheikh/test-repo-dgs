const express = require('express');
const { getCollections } = require('../controllers/collectionsController');
const auth = require('../middleware/auth');
const router = express.Router();


router.get( '/icc/table', getCollections);


module.exports = router;