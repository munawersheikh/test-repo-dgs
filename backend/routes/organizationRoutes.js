const express = require('express');
const { createOrganization, getOrganizations, getOrganizationById, updateOrganization, deleteOrganization } = require('../controllers/organizationController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', createOrganization);
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

module.exports = router;
