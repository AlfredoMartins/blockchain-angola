const express_api = require('express')
const app_api = express_api()
const cors = require('cors');
const corsOptions = require('../config/coreOptions');
// <--- Middleware --->

app_api.use(express_api.json());
app_api.use(express_api.urlencoded({ extended: false }));
app_api.use(cors(corsOptions));

module.exports = function (blockchain, allNodes) {
    const redirectRoute = (text) => require(text)(blockchain, allNodes);

    // <--- API ROUTE END-POINTS --->
    app_api.use('/blockchain', redirectRoute('./routes/blockchain.route'));
    app_api.use('/committee', require('./routes/committee.route'));

    return app_api;
}