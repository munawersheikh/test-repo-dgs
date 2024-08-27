const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const UserNode = sequelize.define('UserNodes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nodeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['nodeId', 'userId'] // Ensuring the combination of nodeId and userId is unique
        }
    ]
});

module.exports = UserNode;
