const UserApplication = require('../models/userApplication');
const messages = require('../config/messages.json');

exports.createUserApplication = async (req, res) => {
    try {
        const userApplication = await UserApplication.create(req.body);
        res.status(201).json({ message: messages.userApplication.created, userApplication });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        const userApplications = await UserApplication.findAll();
        if (userApplications.length==0) {
            return res.status(404).json({ message: messages.userApplication.notFound });
        }
        res.status(200).json(userApplications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserApplicationById = async (req, res) => {
    try {
        const userApplication = await UserApplication.findByPk(req.params.id);
        if (!userApplication) {
            return res.status(404).json({ message: messages.userApplication.notFound });
        }
        res.status(200).json(userApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserApplication = async (req, res) => {
    try {
        const [updated] = await UserApplication.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.userApplication.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserApplication = async (req, res) => {
    try {
        const deleted = await UserApplication.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.userApplication.notFound });
        }
        res.status(200).json({ message: messages.userApplication.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
