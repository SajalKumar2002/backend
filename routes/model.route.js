const { Router } = require("express");
const {
    displayModel,
    addModel
} = require("../controllers/model.controller");

const {
    getAccessToRoute
} = require('../middleware/authentication.Middleware')

const ModelRouter = Router();

ModelRouter
    .get("/", displayModel)
    .post("/", getAccessToRoute, addModel)

module.exports = ModelRouter;