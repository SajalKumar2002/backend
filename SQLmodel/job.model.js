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
    expectedTime: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: () => {
            const date = new Date();
            date.setMinutes(date.getMinutes() + 10);
            return date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString("en-US");
        }
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