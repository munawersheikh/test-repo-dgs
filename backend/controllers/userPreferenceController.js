const UserPreference = require('../models/userPreference');
const messages = require('../config/messages.json');

exports.createUserPreference = async (req, res) => {
    try {
        const userPreference = await UserPreference.create(req.body);
        res.status(201).json({ message: messages.userPreference.created, userPreference });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserPreferences = async (req, res) => {
    try {
        const userPreferences = await UserPreference.findAll();
        if (userPreferences.length==0) {
            return res.status(404).json({ message: messages.userPreference.notFound });
        }
        res.status(200).json(userPreferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserPreferenceById = async (req, res) => {
    try {
        const userPreference = await UserPreference.findByPk(req.params.id);
        if (!userPreference) {
            return res.status(404).json({ message: messages.userPreference.notFound });
        }
        res.status(200).json(userPreference);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserPreference = async (req, res) => {
    try {
        const [updated] = await UserPreference.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.userPreference.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserPreference = async (req, res) => {
    try {
        const deleted = await UserPreference.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.userPreference.notFound });
        }
        res.status(200).json({ message: messages.userPreference.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
