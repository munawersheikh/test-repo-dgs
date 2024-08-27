const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const UserSite = sequelize.define('UserSite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false
});

module.exports = UserSite;
