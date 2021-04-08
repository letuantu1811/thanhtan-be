const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/sampham.controller");
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
router.get("/hide", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getAllHiddenProduct();
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.get("/inventory", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getInventory();
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.get("/medicines", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getAllMedicines();
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Creating san pham
router.post("/create", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.create(body);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// Creating multi product
router.post("/createMulti", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.createMulti(body);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        response.error(res, err, 500)
    }
});

// Getting many appointment
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
// Getting many appointment
router.delete("/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await controller.disable(id);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;