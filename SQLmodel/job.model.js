const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/SQLconnection");

const User = require('./user.model');

const Job = sequelize.define("Job", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    createdAt: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => {
            const date = new Date();
            return date.toLocaleDateString('en-GB') + " - " + date.toLocaleTimeString("en-US");
        }
    },
    completedTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.TEXT,
        defaultValue: () => "waiting",
    },
    userid: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        }
    }
});

module.exports = Job