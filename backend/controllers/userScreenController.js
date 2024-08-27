const UserScreen = require('../models/userScreen');
const messages = require('../config/messages.json');

exports.createUserScreen = async (req, res) => {
    try {
        const userScreen = await UserScreen.create(req.body);
        res.status(201).json({ message: messages.userScreen.created, userScreen });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserScreens = async (req, res) => {
    try {
        const userScreens = await UserScreen.findAll();
        if (userScreens.length==0) {
            return res.status(404).json({ message: messages.userScreen.notFound });
        }
        res.status(200).json(userScreens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserScreenById = async (req, res) => {
    try {
        const userScreen = await UserScreen.findByPk(req.params.id);
        if (!userScreen) {
            return res.status(404).json({ message: messages.userScreen.notFound });
        }
        res.status(200).json(userScreen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserScreen = async (req, res) => {
    try {
        const [updated] = await UserScreen.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.userScreen.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserScreen = async (req, res) => {
    try {
        const deleted = await UserScreen.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.userScreen.notFound });
        }
        res.status(200).json({ message: messages.userScreen.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
