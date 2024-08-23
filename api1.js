const axios = require('axios');

const api = axios.create({
    baseURL: "https://c5c1-35-230-72-55.ngrok-free.app"

})

module.exports = api;
