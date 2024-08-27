const UserNode = require('../models/userNode');
const messages = require('../config/messages.json');

exports.createUserNode = async (req, res) => {
    try {
        const userNode = await UserNode.create(req.body);
        res.status(201).json({ message: messages.userNode.created, userNode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserNodes = async (req, res) => {
    try {
        const userNodes = await UserNode.findAll();
        if (userNodes.length==0) {
            return res.status(404).json({ message: messages.userNode.notFound });
        }
        res.status(200).json(userNodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserNodeById = async (req, res) => {
    try {
        const userNode = await UserNode.findByPk(req.params.id);
        if (!userNode) {
            return res.status(404).json({ message: messages.userNode.notFound });
        }
        res.status(200).json(userNode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserNode = async (req, res) => {
    try {
        const [updated] = await UserNode.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.userNode.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserNode = async (req, res) => {
    try {
        const deleted = await UserNode.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.userNode.notFound });
        }
        res.status(200).json({ message: messages.userNode.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
