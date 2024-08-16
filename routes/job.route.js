const { Router } = require("express");
const {
    displayJobDetails,
    generateJob,
} = require("../controllers/job.controller");

const {
    getAccessToRoute
} = require('../middleware/authentication.Middleware')

const JobsRouter = Router();

JobsRouter
    .get("/", getAccessToRoute, displayJobDetails)
    .get("/generate", getAccessToRoute, generateJob)

module.exports = JobsRouter;