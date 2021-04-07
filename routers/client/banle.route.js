const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/banle.controller");
const response = require('../../utils/api.res/response');

router.get("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getAll();
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Creating donvitinh
router.post("/create", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.createOrders(body);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Getting many donvitinh
router.post("/", async(req, res) => {
    try {
        const result = await controller.getMany(req.body);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;