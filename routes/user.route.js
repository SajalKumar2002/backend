const { Router } = require("express");

const {
    // display,
    // registerUser,
    // deleteUser,

    loginUser,
    logoutUser,
    sendIsUser,
} = require("../controllers/user.controller");

const {
    getAccessToRoute
} = require('../middleware/authentication.Middleware')

const UserRouter = Router();

UserRouter
    // .get("/", display)
    // .post("/register", registerUser)
    .post("/login", loginUser)
    // .delete("/", deleteUser)
    .get("/logout", logoutUser)
    .get("/check", getAccessToRoute, sendIsUser)

module.exports = UserRouter;