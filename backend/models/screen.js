const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Screen = sequelize.define('Screens', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},
{
    timestamps: false
});

module.exports = Screen;
