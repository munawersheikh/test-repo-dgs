const Node = require('../models/nodes');
const messages = require('../config/messages.json');

exports.createNode = async (req, res) => {
    try {
        const node = await Node.create(req.body);
        res.status(201).json({ message: messages.node.created, node });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNodes = async (req, res) => {
    try {
        const nodes = await Node.findAll();
        if (nodes.length==0) {
            return res.status(404).json({ message: messages.node.notFound });
        }
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNodeById = async (req, res) => {
    try {
        const node = await Node.findByPk(req.params.id);
        if (!node) {
            return res.status(404).json({ message: messages.node.notFound });
        }
        res.status(200).json(node);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateNode = async (req, res) => {
    try {
        const [updated] = await Node.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.node.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNode = async (req, res) => {
    try {
        const deleted = await Node.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.node.notFound });
        }
        res.status(200).json({ message: messages.node.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
