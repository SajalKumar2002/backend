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
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${db_name};`);
}

exports.createTableFromCSV = async (sequelize, modelName, jsonData) => {
    const columns = jsonData?.meta?.fields

    const tableHeaders = {}

    columns.forEach((key) => {
        tableHeaders[key] = {
            type: DataTypes.STRING,
            allowNull: true,
        };
    })

    const DynamicModel = sequelize.define(modelName, tableHeaders);

    await DynamicModel.sync({ alter: true })

    await DynamicModel.bulkCreate(jsonData.data);
    const sampleData = DynamicModel.findAll();
    return sampleData;
}

// create connection
// create database
// create table from table name extracted from filename
// Bulk add to that table
// 