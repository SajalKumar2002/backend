const Papa = require("papaparse");

const {
  getObject,
  deleteObjects,
  deleteObject,
} = require("../helpers/bucket.helper");

const { nameExtractor, arrayDivider } = require("../helpers/upload.helper");

const { api1, api2, api3 } = require("../api");

const {
  connection,
  createDatabase,
  deleteDatabase,
  generateDatabaseName,
  createTableFromCSV,
} = require("../helpers/mysql.helper");

const apiCall = async (api, data) => {
  try {
    const response = await api.post("/set_db_config", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (
      response.status === 200 &&
      response?.data?.message === "Connection established with the Database"
    )
      return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const SQLConnector = async (req, res) => {
  const data = req.body;
  try {
    if (apiCall(api1) && apiCall(api2)) {
      res.send({ message: "Connection established with the Database" });
      return;
    } else {
      res.send({ message: "Connection Failed with the Database" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const CSVHandler = async (req, res) => {
  let sequelize;
  let db_name;
  const CSVFiles = req.files;
  try {
    const initialConnection = connection();

    if (!req.query?.database) {
      if (CSVFiles.length === 0) {
        return res.status(400).send({ error: "No S3 URLs provided" });
      }

      await initialConnection.authenticate();

      db_name = await generateDatabaseName(initialConnection, "llmboxx");

      if (db_name === null) {
        await deleteObject(CSVFiles);
        return res
          .status(400)
          .send({ error: "Database name generation failed" });
      }
      await createDatabase(initialConnection, db_name);
    } else {
      db_name = req.query.database;
    }

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
          );

          const sampleTable = arrayDivider(jsonFormattedData, 5);

          tables.push({
            name: modelName,
            table: sampleTable,
          });
        } catch (error) {
          deleteObjects(CSVFiles);
          deleteDatabase(sequelize, db_name);
          console.log(error);
          return res
            .status(400)
            .send({ error: "Converting CSV data to json Failed" });
        }
      }
    } catch (error) {
      deleteObjects(CSVFiles);
      deleteDatabase(sequelize, db_name);
      console.log(error);
      return res.status(400).send({ error: "Reading CSV data failed" });
    }

    // const config = {
    //     "user": process.env.DB_USERNAME,
    //     "password": process.env.DB_PASS,
    //     "host": process.env.DB_HOST,
    //     "port": process.env.DB_PORT,
    //     "database": db_name
    // }

    // try {
    //     await api1.post("/set_db_config", config)
    //     await api2.post("/set_db_config", config)
    // } catch (error) {
    //     deleteDatabase(sequelize, db_name);
    //     deleteObjects(CSVFiles);

    //     return res.status(400).send({ error: "Database connection failed" })
    // }

    return res.status(200).send({
      database: db_name,
      tables: tables,
    });
  } catch (error) {
    console.error("Error:", error);
    await deleteObjects(CSVFiles);
    return res.status(400).send({ error: "Creating DB faild" });
  }
};

const PDFHandler = async (req, res) => {
  try {
    res.send({ file: req.file.location });
  } catch (error) {
    console.error("Error:", error);
    await deleteObject(req.file.key);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  CSVHandler,
  PDFHandler,
};
