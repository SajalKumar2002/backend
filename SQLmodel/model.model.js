const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/SQLconnection");

const Users = require('./user.model')

const Model = sequelize.define("Model", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    model_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    vector_db_link: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //     isUrl: true
        // }
    },
    base_model: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isIn: [['gemini', 'llama2']]
        }
    },
    userid: {
        type: DataTypes.UUID,
        references: {
            model: Users,
            key: 'id'
        }
    }
})

module.exports = Model;
