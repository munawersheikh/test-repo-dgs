const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Organization = sequelize.define('Organizations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customerFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    primaryPOCName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    primaryPOCEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    primaryPOCPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
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

module.exports = Organization;
