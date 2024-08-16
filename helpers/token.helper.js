const jwt = require('jsonwebtoken')

exports.sendTokenToClient = (client, res) => {
    const token = jwt.sign(client, process.env.JWT_TOKEN);
    res.cookie("usertoken", token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        }
    )
    res
        .status(200)
        .send({ success: true, message: "Successfully Logged In" })
}

exports.checkCookiePresence = (req, res) => {
    return req.cookies.usertoken ? true : false;
}

exports.verifyCookie = (req, res) => {
    return jwt.verify(req.cookies.usertoken, process.env.JWT_TOKEN)
}

