const initClientAPI = require('./client')
let initAPI = (app) => {
    initClientAPI(app, "/api/client/");
}

module.exports = initAPI;