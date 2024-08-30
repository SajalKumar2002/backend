require("dotenv").config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { createConnection } = require('./config/SQLconnection.js');

const UserRouter = require('./routes/user.route.js');
const JobRouter = require('./routes/job.route.js');
const ModelRouter = require('./routes/model.route.js');
const DataSourceRouter = require('./routes/datasourse.route.js')

const app = express();

const path = require('path');
const { deleteObject } = require("./helpers/bucket.helper.js");
const buildpath = path.join(__dirname, "../frontend/build")
app.use(express.static(buildpath))

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/user", UserRouter);
app.use("/api/job", JobRouter)
app.use("/api/llm", ModelRouter);
app.use("/api/data", DataSourceRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(buildpath, 'index.html'));
});

app.listen(PORT, async () => {
    createConnection();
    console.log("Server is running on " + PORT);
});