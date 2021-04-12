const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/thanhvien.controller");
const response = require('../../utils/api.res/response');

router.get("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getMany();
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/roles", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.getRole();
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Creating thanhvien
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

router.put("/", async(req, res) => {
    let data = req.body;
    try {
        const result = await controller.update(data);
        
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;