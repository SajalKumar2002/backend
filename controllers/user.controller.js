const bcrypt = require('bcrypt');

const User = require("../SQLmodel/user.model");

const {
    sendTokenToClient
} = require('../helpers/token.Helper')

const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } })
        if (!existingUser) {
            const hash = await bcrypt.hash(req.body.password, 10)
            await User.create(
                {
                    email: req.body.email,
                    password: hash
                }
            );
            res.status(201).send({ success: true, mesage: "Successfully created" })
        } else {
            res.status(409).send({ success: false, message: "User Already exists" })
        }
    } catch (error) {
        console.error(error)
        res.send({ success: false, message: "Service Error", error })
    }
}

const loginUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } })
        if (!existingUser) {
            res.status(401).send({ success: false, message: "User not found or incorrect credentials" })
        } else {
            bcrypt.compare(req.body.password, existingUser.password, function (err, result) {
                if (result) {
                    sendTokenToClient(
                        {
                            id: existingUser.id,
                            email: existingUser.email
                        },
                        res
                    )
                }
                else
                    res.send({ success: false, message: "Incorrect Credentials" })
            });
        }
    } catch (error) {
        console.error(error)
        res.send({ success: false, message: "Service Error", error })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('usertoken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).send({ success: true, message: 'Successfully Logged Out' });
    } catch (error) {
        console.error(error)
        res.send({ success: false, message: "Service Error", error })
    }
}

const display = async (req, res) => {
    const users = await User.findAll();
    if (users) {
        res.status(201).send(users)
    }
}

const sendIsUser = (req, res) => {
    res.status(200).send({ success: true });
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
            await User.destroy({ where: { email: req.body.email } })
            res.send({ success: true, message: "User Deleted" })
        } else {
            res.send({ success: true, message: "User Not Found" })
        }
    } catch (error) {
        console.error(error)
        res.send({ success: false, message: "Service Error", error })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    sendIsUser,
    deleteUser,

    display
}