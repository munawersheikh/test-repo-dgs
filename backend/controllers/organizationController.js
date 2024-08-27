const Organization = require('../models/organization');
const messages = require('../config/messages.json');

exports.createOrganization = async (req, res) => {
    try {
        const organization = await Organization.create(req.body);
        res.status(201).json({ message: messages.organization.created, organization });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll();
        if (organizations.length==0) {
            return res.status(404).json({ message: messages.organization.notFound });
        }
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: messages.organization.notFound });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrganization = async (req, res) => {
    try {
        const [updated] = await Organization.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.organization.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const deleted = await Organization.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.organization.notFound });
        }
        res.status(200).json({ message: messages.organization.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
