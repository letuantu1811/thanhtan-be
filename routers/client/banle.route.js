const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/banle.controller");
const response = require('../../utils/api.res/response');
const { PRINT_MODE } = require("../../utils/enum");

router.get("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getAll();

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.post("/prints/:mode", async(req, res) => {
    try {
        const mode = req.params.mode.toUpperCase();
        const billAsPayload = req.body;
        const userId = req.header('id');
        
        const result = await controller.printBill(userId, mode, billAsPayload);

        return response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        return response.error(res, err.message, 500, req.url);
    }
});

// Creating donvitinh
router.post("/create", async(req, res) => {
    let body = req.body;
    try {  
        const result = await controller.createOrders(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Getting many donvitinh
router.post("/", async(req, res) => {
    try {
        const result = await controller.getMany(req.body);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// disable don hang
router.delete("/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await controller.disable(id);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;