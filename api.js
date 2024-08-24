const axios = require('axios');

const api1 = axios.create({
    baseURL: "https://3794-34-126-128-73.ngrok-free.app"
})

const api2 = axios.create({
    baseURL: "https://a69c-35-247-79-139.ngrok-free.app"
})

const api3 = axios.create({
    baseURL: "https://4117-34-145-83-50.ngrok-free.app"
})

module.exports = {
    api1, api2, api3
};
