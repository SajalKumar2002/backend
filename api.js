const axios = require('axios');

const api1 = axios.create({
    baseURL: "https://74ed-34-16-137-8.ngrok-free.app"
})

const api2 = axios.create({
    baseURL: "https://dfb2-34-74-243-200.ngrok-free.app"
})

const api3 = axios.create({
    baseURL: "https://4117-34-145-83-50.ngrok-free.app"
})

module.exports = {
    api1, api2, api3
};
