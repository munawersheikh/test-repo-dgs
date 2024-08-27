const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Application = sequelize.define('Applications', {
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
    
},{
    timestamps: false
});

module.exports = Application;
