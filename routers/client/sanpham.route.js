const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/sampham.controller");
const response = require('../../utils/api.res/response');
const thanhvien = require('../../database/models/thanhvien');

router.get("/", async(req, res) => {
    let quyen = req.header("quyen");
    console.log(quyen);
    try {
        const result = await controller.getAll(quyen);
        // 
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// router.get("/hide", async(req, res) => {
//     try {
//         const result = await controller.getAllHiddenProduct();
//         
//         response.success(res, "success", result)
//     } catch (err) {
//         console.log(err.message);
//         response.error(res, "failed", 500)
//     }
// });
router.get("/inventory", async(req, res) => {
    try {
        const result = await controller.getInventory();

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.get("/medicines", async(req, res) => {
    let role = req.header("quyen");;
    console.log(role);
    try {
        // let ids = await thanhvien.findOne({ id: id });
        // console.log(ids.get({ plain: 'text' }));
        const result = await controller.getAllMedicines(role);
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

        response.success(res, "success", result)
    } catch (err) {
        response.error(res, err, 500)
    }
});

// Getting many appointment
router.post("/", async(req, res) => {
    try {
        const result = await controller.getMany(req.body);

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