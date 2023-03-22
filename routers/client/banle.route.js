const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/banle.controller");
const response = require('../../utils/api.res/response');

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

router.get("/prints", async(req, res) => {
    try {
        const result = await controller.printOrder();

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