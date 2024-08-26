const axios = require('axios');

const api1 = axios.create({
    baseURL:"https://2ab9-35-233-200-211.ngrok-free.app" 
})

const api2 = axios.create({
    baseURL: "https://d730-34-28-166-105.ngrok-free.app"
})

const api3 = axios.create({
    baseURL: "https://4117-34-145-83-50.ngrok-free.app"
})

module.exports = {
    api1, api2, api3
};
