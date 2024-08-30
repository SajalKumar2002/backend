const { Router } = require("express");

const {
    SQLConnector,
    CSVHandler,
    PDFHandler
} = require('../controllers/datasourse.controller')

const { upload } = require('../config/mutler')

const DataSourceRouter = Router();

DataSourceRouter.post("/csv", upload.array('files', 5), CSVHandler)
DataSourceRouter.post("/pdf", upload.single('files'), PDFHandler)
DataSourceRouter.post("/sql",SQLConnector)

module.exports = DataSourceRouter;