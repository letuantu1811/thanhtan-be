require('dotenv').config();
const {readFileSync} = require('fs');
const { toNumber } = require('lodash');
const path = require('path');

const appPackage = readFileSync(`${__dirname}/../package.json`, {
    encoding: 'utf8',
});
const appData = JSON.parse(appPackage);

const config = {
    version: appData.version,
    port: toNumber(process.env.APP_PORT),
    host: process.env.APP_HOST,
    assetsPath: path.join(__dirname, '../assets'),
    templatePath: path.join(__dirname, '../assets/templates/{mode}.html'),
};

module.exports = config;
