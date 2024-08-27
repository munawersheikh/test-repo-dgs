const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const UserPreference = sequelize.define('UserPreferences', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modifiedOn: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['name', 'userId'] // Ensuring the combination of nodeId and userId is unique
        }
    ]
});

module.exports = UserPreference;
