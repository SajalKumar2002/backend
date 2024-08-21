const csv = require('csvtojson');
const { Sequelize, DataTypes } = require('sequelize');

exports.connection = (db_name = null) => new Sequelize(
    db_name,
    process.env.DB_USERNAME,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        port: 3306,
    }
);

exports.generateDatabaseName = async (sequelize, basename) => {
    try {
        const result = await sequelize.query(`SHOW DATABASES like "${basename}%"`);
        const index = result[0].length + 1;
        return basename + index;
    } catch (error) {
        console.error("Error checking database:", error);
        return null;
    }
}

exports.createDatabase = async (sequelize, db_name) => {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${db_name};`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.createTableFromCSV = async (sequelize, modelName, csvData) => {
    jsonData = await csv().fromString(csvData);
    const columns = {};

    Object.keys(jsonData[0]).forEach((key) => {
        columns[key] = {
            type: DataTypes.STRING,
            allowNull: true,
        };
    });

    const DynamicModel = sequelize.define(modelName, columns);

    DynamicModel.sync({ alter: true })
        .catch(error => {
            console.error('Error syncing:', error.original);
        });

    const sampleData = await DynamicModel.bulkCreate(jsonData);

    return sampleData
}