require('dotenv').config();
const {readFileSync} = require('fs');
const { toNumber } = require('lodash');
const path = require('path');

const appPackage = readFileSync(`${__dirname}/../package.json`, {
    encoding: 'utf8',
});
const appData = JSON.parse(appPackage);
const assetsPath = path.join(__dirname, '../assets/');

const config = {
	version: appData.version,
	port: toNumber(process.env.APP_PORT),
	host: process.env.APP_HOST,
	assetsPath: assetsPath,
	templateExamInvoicePath: `${assetsPath}templates/exam-invoice/`,
	templateBillPath: `${assetsPath}templates/order-invoice/`,
};

module.exports = config;
