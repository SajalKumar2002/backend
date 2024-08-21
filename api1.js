const axios = require('axios');

const api = axios.create({
    baseURL: "https://f52e-34-16-219-242.ngrok-free.app"
})

module.exports = api;
