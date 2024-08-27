const express = require('express');
const auth = require('../middleware/auth');
const { getPsd } = require('../controllers/psdController');
const router = express.Router();


router.get( '/icc/api/get_average_psd_data_mask_threshold', getPsd);


module.exports = router;