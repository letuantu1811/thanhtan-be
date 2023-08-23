const express = require('express');

const router = express.Router();
const {
    getOrderList,
    getOrderList_v2,
    createOrder,
    printBill
} = require('../../src.web/controllers/banle.controller');

router.get('/', getOrderList);

router.get('/v2', getOrderList_v2);

router.post('/prints/:mode', printBill);

router.post('/create', createOrder);

module.exports = router;
