const axios = require('axios');

const api = axios.create({
    baseURL: "https://afa1-35-227-141-24.ngrok-free.app"
})

module.exports = api;
