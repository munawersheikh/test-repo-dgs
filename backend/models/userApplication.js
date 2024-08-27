const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const UserApplication = sequelize.define('UserApplications', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    applicationId: {
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
            fields: ['applicationId', 'userId'] // Ensuring the combination of applicationId and userId is unique
        }
    ]
});

module.exports = UserApplication;
