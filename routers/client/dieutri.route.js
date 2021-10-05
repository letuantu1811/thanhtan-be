const express = require("express");
const router = express.Router();;
const controller = require("../../src.web/controllers/khachhang.controller");
const dieutri = require("../../src.web/controllers/dieutri.controller");
const truyxuatbenhan = require("../../src.web/controllers/truyxuatbenhan.controller");
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

// Getting many exam by pet id
router.get("/examByPetId", async(req, res) => {
    try {
        let id = req.query.id
        let phieudieutriid = req.query.phieudieutriid
        console.log(phieudieutriid + "123");
        const result = await dieutri.getAllExamByPetId(id, phieudieutriid);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Update many exam by pet id
router.put("/updateHSBA", async(req, res) => {
    let data = req.body;
    try {
        const result = await dieutri.updateHSBA(data);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Update pet by pet id
router.put("/updatePet", async(req, res) => {
    let data = req.body;
    try {
        const result = await dieutri.updatePet(data);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// delete pet by pet id
router.delete("/deletePet", async(req, res) => {
    let data = req.query.id;
    try {
        const result = await dieutri.deletePet(data);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// deleteDT by pet id
router.delete("/deleteDT", async(req, res) => {
    let data = req.query.id;
    try {
        const result = await dieutri.deleteDT(data);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// Getting many exam by pet id
router.get("/getExaminationWithRabisin", async(req, res) => {
    try {
        const result = await truyxuatbenhan.getExaminationWithRabisin();
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// Getting many exam by pet id
router.get("/getExaminationWithMedicin/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await truyxuatbenhan.getExaminationWithMedicinName(id);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

//get pets examination
router.get("/getPetExamination", async(req, res) => {
    let role = req.header("quyen");
    try {
        const result = await dieutri.getPetExamination(role);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});


//get pets examination
router.get("/getPetMedicalHistory/:id", async(req, res) => {
    let petID = req.params.id;
    try {
        const result = await dieutri.getPetMedicalHistory(petID);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});


module.exports = router;