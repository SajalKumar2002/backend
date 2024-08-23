const axios = require('axios');

const api = axios.create({
  baseURL: "https://9c64-34-125-228-233.ngrok-free.app"
})

module.exports = api;
