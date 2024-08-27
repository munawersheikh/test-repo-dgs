const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Site = sequelize.define('Sites', {
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
    location: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    organizationId: {
        type: DataTypes.INTEGER,
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
}
,
{
    timestamps: false
}
);

module.exports = Site;
