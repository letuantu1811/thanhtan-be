const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/khachhang.controller");
const dieutri = require("../../src.web/controllers/dieutri.controller");
const response = require('../../utils/api.res/response');


// Getting many khachhang
router.get("/notification", async(req, res) => {
    try {
        const result = await dieutri.getNotification();

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.getAllToday();

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/detail/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await dieutri.getOne(id);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/reexam", async(req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.getReExamToday();

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Creating khachhang
router.post("/create", async(req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.create(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// Creating khachhang
router.post("/createHoSo", async(req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.createHoSo(body);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.post("/importEXAM", async(req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.importEXAM(body);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.post("/importSP", async(req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.importServicePlus(body);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Getting many khachhang
router.get("/all", async(req, res) => {
    let role = req.header("quyen");
    try {
        const result = await dieutri.getAll(role);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});



module.exports = router;