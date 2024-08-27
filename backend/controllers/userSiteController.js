const UserSite = require('../models/userSite');
const messages = require('../config/messages.json');

exports.createUserSite = async (req, res) => {
    try {
        const userSite = await UserSite.create(req.body);
        res.status(201).json({ message: messages.userSite.created, userSite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserSites = async (req, res) => {
    try {
        const userSites = await UserSite.findAll();
        if (userSites.length==0) {
            return res.status(404).json({ message: messages.userSite.notFound });
        }
        res.status(200).json(userSites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserSiteById = async (req, res) => {
    try {
        const userSite = await UserSite.findByPk(req.params.id);
        if (!userSite) {
            return res.status(404).json({ message: messages.userSite.notFound });
        }
        res.status(200).json(userSite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserSite = async (req, res) => {
    try {
        const [updated] = await UserSite.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.userSite.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserSite = async (req, res) => {
    try {
        const deleted = await UserSite.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.userSite.notFound });
        }
        res.status(200).json({ message: messages.userSite.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
