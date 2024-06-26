const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/chungloai.controller");
const response = require('../../utils/api.res/response');

router.get("/", async(req, res) => {
    try {
        const result = await controller.getAll();
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Creating chungloai
router.post("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.create(body);
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// update chungloai
router.put("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.update(body);
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Getting many chungloai
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