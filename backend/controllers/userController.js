const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const messages = require('../config/messages.json');

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, userName: user.userName, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

exports.register = async (req, res) => {
    const { userName, organizationId, role, systemID, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ userName, organizationId, role, systemID, email, password: hashedPassword });
        res.status(201).json({ message: messages.user.created, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: messages.user.notFound });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (users.length==0) {
            return res.status(404).json({ message: messages.user.notFound });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: messages.user.notFound });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: messages.user.updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: messages.user.notFound });
        }
        res.status(200).json({ message: messages.user.deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
