const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Node = sequelize.define('Nodes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensuring the node name field is unique by itself
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    modifiedOn: {
        type: DataTypes.DATE,
        allowNull: true
    },
    modifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},
{
    timestamps: false
});

module.exports = Node;
