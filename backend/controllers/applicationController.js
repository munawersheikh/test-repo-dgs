const Application = require('../models/application');
const messages = require('../config/messages.json');

exports.createApplication = async (req, res) => {
    try {
        const application = await Application.create(req.body);
        res.status(201).json({ message: messages.application.created, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const applications = await Application.findAll();
        if (applications.length==0) {
            return res.status(404).json({ message: messages.application.notFound });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) {
            return res.status(404).json({ message: messages.application.notFound });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const [updated] = await Application.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.application.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const deleted = await Application.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.application.notFound });
        }
        res.status(200).json({ message: messages.application.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
