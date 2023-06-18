const express = require('express');

const router = express.Router();
const {
    getOrderList,
    createOrder,
    printBill,
} = require('../../src.web/controllers/banle.controller');

router.get('/', getOrderList);

router.post('/prints/:mode', printBill);

router.post('/create', createOrder);

module.exports = router;
