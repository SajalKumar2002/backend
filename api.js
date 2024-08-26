const axios = require('axios');

const api1 = axios.create({
    baseURL: "https://e66b-34-16-209-104.ngrok-free.app"
})

const api2 = axios.create({
    baseURL: "https://24ab-34-73-247-102.ngrok-free.app"
})

const api3 = axios.create({
    baseURL: "https://4117-34-145-83-50.ngrok-free.app"
})

module.exports = {
    api1, api2, api3
};
