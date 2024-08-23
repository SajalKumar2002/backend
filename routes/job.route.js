const { Router } = require("express");
const {
    displayJobDetails,
    generateJob,
    switchJobStatus,
    deleteJob
} = require("../controllers/job.controller");

const {
    getAccessToRoute
} = require('../middleware/authentication.Middleware')

const JobsRouter = Router();

JobsRouter
    .get("/", getAccessToRoute, displayJobDetails)
    .get("/generate", getAccessToRoute, generateJob)
    .post('/switch', getAccessToRoute, switchJobStatus)
    .delete('/', getAccessToRoute, deleteJob)

module.exports = JobsRouter;