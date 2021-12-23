const express = require("express");
const router = express.Router();
const controller = require("../../src.web/controllers/thongke.controller");
const response = require('../../utils/api.res/response');

router.get("/", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        console.log(startDate + " " + endDate);
        const result = await controller.thongKeDoanhThuTheoNgay(startDate, endDate);
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;