const Papa = require('papaparse');

const {
    getObject,
    getObjectUrl
} = require('../helpers/bucket.helper');

const {
    nameExtractor,
    arrayDivider
} = require('../helpers/upload.helper')

const {
    api1,
    api2,
    api3
} = require('../api');

const {
    connection,
    createDatabase,
    generateDatabaseName,
    createTableFromCSV,
} = require('../helpers/mysql.helper')

const CSVHandler = async (req, res) => {
    let sequelize;
    let db_name;
    try {
        const CSVFiles = req.files;

        if (CSVFiles.length === 0) {
            return res.status(400).send({ "error": "No S3 URLs provided" });
        }

        const initialConnection = connection();
        await initialConnection.authenticate();

        db_name = await generateDatabaseName(initialConnection, 'llmboxx');

        if (db_name === null) {
            return res.status(400).send({ error: "Database name generation failed" });
        }

        await createDatabase(initialConnection, db_name);

        sequelize = connection(db_name);

        let tables = [];

        try {
            for (const file of CSVFiles) {

                const { Body } = await getObject(file.key);

                const csvData = await Body?.transformToString("utf-8");

                const jsonData = Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                });

                const modelName = nameExtractor(file);

                try {
                    const jsonFormattedData = await createTableFromCSV(
                        sequelize,
                        modelName,
                        jsonData
                    )

                    const sampleTable = arrayDivider(
                        jsonFormattedData,
                        5
                    );

                    tables.push(
                        {
                            name: modelName,
                            table: sampleTable
                        }
                    )
                } catch (error) {
                    console.log(error);
                    return res.status(400).send({ error: error })
                }

            }


        } catch (error) {
            console.log(error);
            return res.status(400).send({ error: error })
        }

        const config = {
            "user": process.env.DB_USERNAME,
            "password": process.env.DB_PASS,
            "host": process.env.DB_HOST,
            "port": process.env.DB_PORT,
            "database": db_name
        }

        try {
            await api1.post("/set_db_config", config)
            await api2.post("/set_db_config", config)
        } catch (error) {
            console.log(error.response);
            return res.status(400).send({ error: "Database connection failed" })
        }

        return res.status(200).send(
            {
                database: db_name,
                tables: tables
            }
        );

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: error });
    }
}

const PDFHandler = async (req, res) => {
    try {
        const fileUrl = await getObject(req.file.key);
        console.log(fileUrl);
        // res.send(fileUrl)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error });
    }
}

module.exports = {
    CSVHandler,
    PDFHandler
}
