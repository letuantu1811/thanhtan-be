const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/bacsi.controller");
const response = require('../../utils/api.res/response');
const auth = require("../../middlewares/auth.middleware");

router.get("/", async(req, res) => {
    try {
        const result = await controller.getAll();
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Creating bacsi
router.post("/create", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.create(body);
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Getting many bacsi
router.post("/", async(req, res) => {
    try {
        const result = await controller.getMany(req.body);
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;