const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/khachhang.controller");
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

// Creating khachhang
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

// Creating khachhang
router.post("/new", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.createNewCustomer(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// Updating khachhang
router.put("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await controller.updateCustomer(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// Delete khachhang
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

// Getting new pet
router.post("/newpet", async(req, res) => {
    try {
        const result = await controller.createNewPet(req.body);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Delete thu cung
router.delete("/pet/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await controller.disablePet(id);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.post("/import", async(req, res) => {
    let data = req.body;
    try {
        console.log("Ádasd");
        const result = await controller.import(data);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.post("/importPet", async(req, res) => {
    let data = req.body;
    try {
        console.log("Ádasd");
        const result = await controller.importPet(data);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});


router.get("/filter", async(req, res) => {
    // let data = req.body;
    try {
        console.log("Ádasd");
        const result = await controller.locKH();

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

/*
@param id:  the id of the pet
*/
router.put("/pet", async(req, res) => {
    let body = req.body;
    try {
        console.log(body);
        const result = await controller.editPet(body);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;