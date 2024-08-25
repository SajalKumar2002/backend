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

const getStream = async () => {
    const module = await import('get-stream');
    return module.default;
};

const CSVHandler = async (req, res) => {
    let sequelize;
    try {
        const CSVFiles = req.files;

        if (CSVFiles.length === 0) {
            return res.status(400).send({ "error": "No S3 URLs provided" });
        }

        let db_name;

        if (req.query?.database) {
            db_name = req.query.database;
        } else {
            const initialConnection = connection();
            await initialConnection.authenticate();

            db_name = await generateDatabaseName(initialConnection, 'llm');

            if (db_name === null) {
                return res.status(400).send({ error: "Database creation failed" });
            }
            const isDatabaseCreated = createDatabase(initialConnection, db_name);
            if (!isDatabaseCreated) {
                return res.status(400).send({ error: "Database creating failed" })
            }
        }

        sequelize = connection(db_name);

        const fileProcessingPromises = CSVFiles.map(async (file) => {
            const CSVData = await getObject(file.key);
            const csvData = await getStream(CSVData.Body);
            const modelName = nameExtractor(file);
            const jsonData = await createTableFromCSV(sequelize, modelName, csvData);
            return {
                name: modelName,
                table: arrayDivider(jsonData, 5),
            };
        });

        const tables = await Promise.all(fileProcessingPromises);

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
            console.log(error);
            return res.status(400).send({ error: "Database connection failed" })
        }

        return res.status(200).send({ database: db_name, tables: tables });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: error });
    } finally {
        if (sequelize) await sequelize.close();
    }
}

const PDFHandler = async (req, res) => {
    try {
        const fileUrl = await getObject(req.file.key);
        console.log(fileUrl);
        // res.send(fileUrl)
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: error });
    }
}

module.exports = {
    CSVHandler,
    PDFHandler
}
