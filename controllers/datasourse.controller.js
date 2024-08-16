const csv = require('csvtojson');
const { sequelize } = require("../config/SQLconnection");
const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');

const {
    getObject
} = require('../helpers/bucket.helper');

const {
    nameExtractor,
    arrayDivider
} = require('../helpers/upload.helper')

const SqlConnector = async (req, res) => {
    try {
        const { serveraddress, port, username, password, database } = req.body;
        const sequelize = new Sequelize(database, username, password, {
            host: serveraddress,
            dialect: 'mssql',
            logging: false,
            dialectOptions: {
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                }
            }
        });
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            const tables = await sequelize.getQueryInterface().showAllTables();
            res.send({ success: true, tables })
        } catch (error) {
            console.error('Unable to connect to the database:', error.original.code);
            if (error.original.code == "ELOGIN") res.send({ success: false, message: "Invalid Credentials" }, error.original.code)
        }
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: "Request failed" })
    }
}

const CSVConvertor = async (req, res) => {
    try {
        const CSVFiles = req.files;
        let response = [];

        for (let index = 0; index < CSVFiles.length; index++) {
            const file = CSVFiles[index];

            const CSVData = await getObject(file.key);

            const streamToString = (stream) =>
                new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
                    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
                    stream.on('error', reject);
                });

            const csvData = await streamToString(CSVData.Body);

            jsonData = await csv().fromString(csvData);
            const columns = {};

            const modelName = nameExtractor(file);

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

            await DynamicModel.bulkCreate(jsonData);
            response.push(
                {
                    name: modelName,
                    table: arrayDivider(jsonData, 5)
                }
            )
        }

        res.status(200).send(response);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send({ error: error });
    }
}

module.exports = {
    SqlConnector,
    CSVConvertor
}
