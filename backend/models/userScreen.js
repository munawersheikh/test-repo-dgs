const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const UserScreen = sequelize.define('UserScreens', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    screenId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['screenId', 'userId'] // Ensuring the combination of nodeId and userId is unique
        }
    ]
});

module.exports = UserScreen;
