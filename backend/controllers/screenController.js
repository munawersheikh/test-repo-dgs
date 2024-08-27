const Screen = require('../models/screen');
const messages = require('../config/messages.json');

exports.createScreen = async (req, res) => {
    try {
        const screen = await Screen.create(req.body);
        res.status(201).json({ message: messages.screen.created, screen });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getScreens = async (req, res) => {
    try {
        const screens = await Screen.findAll();
        if (screens.length==0) {
            return res.status(404).json({ message: messages.screen.notFound });
        }
        res.status(200).json(screens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findByPk(req.params.id);
        if (!screen) {
            return res.status(404).json({ message: messages.screen.notFound });
        }
        res.status(200).json(screen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateScreen = async (req, res) => {
    try {
        const [updated] = await Screen.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.screen.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteScreen = async (req, res) => {
    try {
        const deleted = await Screen.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.screen.notFound });
        }
        res.status(200).json({ message: messages.screen.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
