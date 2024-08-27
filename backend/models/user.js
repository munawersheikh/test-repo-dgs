const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    systemID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
}
);

module.exports = User;
