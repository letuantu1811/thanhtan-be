const OrderService = require('../services/OrderService');
const { response } = require('../../utils/api.res');

const getOrderList = async (req, res) => {
    try {
        const result = await OrderService.getOrderList();
        return response.success(res, 'success', result);
    } catch (error) {
        console.log('Error at get getOrderList', error);
        return response.error(res, error.message, 500);
    }
};

const createOrder = async (req, res) => {
    try {
        const result = await OrderService.createOrder(req.body);
        return response.success(res, 'success', result);
    } catch (error) {
        console.log('Error at get createOrder', error);
        return response.error(res, error.message, 500);
    }
};

const printBill = async (req, res) => {
    try {
        const mode = req.params.mode.toUpperCase();
        const billAsPayload = req.body;
        const userId = req.header('id');

        const result = await OrderService.printBill(userId, mode, billAsPayload);

        return response.success(res, 'success', result);
    } catch (error) {
        console.log('Error at get printBill', error);
        return response.error(res, error.message, 500);
    }
};

module.exports.getOrderList = getOrderList;
module.exports.createOrder = createOrder;
module.exports.printBill = printBill;
