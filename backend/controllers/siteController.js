const Site = require('../models/site');
const messages = require('../config/messages.json');

exports.createSite = async (req, res) => {
    try {
        const site = await Site.create(req.body);
        res.status(201).json({ message: messages.site.created, site });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSites = async (req, res) => {
    try {
        const sites = await Site.findAll();
        if (sites.length==0) {
            return res.status(404).json({ message: messages.site.notFound });
        }
        res.status(200).json(sites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSiteById = async (req, res) => {
    try {
        const site = await Site.findByPk(req.params.id);
        if (!site) {
            return res.status(404).json({ message: messages.site.notFound });
        }
        res.status(200).json(site);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSite = async (req, res) => {
    try {
        const [updated] = await Site.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.site.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSite = async (req, res) => {
    try {
        const deleted = await Site.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.site.notFound });
        }
        res.status(200).json({ message: messages.site.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
