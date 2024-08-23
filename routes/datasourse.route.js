const { Router } = require("express");

const {
    CSVHandler,
    PDFHandler
} = require('../controllers/datasourse.controller')

const { upload } = require('../config/mutler')

const DataSourceRouter = Router();

DataSourceRouter.post("/csv", upload.array('files', 5), CSVHandler)
DataSourceRouter.post("/pdf", upload.single('files'), PDFHandler)

module.exports = DataSourceRouter;