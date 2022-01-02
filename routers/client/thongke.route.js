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
        const banle = await controller.thongKeDoanhThuBanLeTheoNgay(startDate, endDate);

        response.success(res, "success", { dieutri: result[0], banle: banle[0] });
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/thongkedieutri", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let dt = await controller.thongKeDoanhThuTheoNgay(startDate, endDate);
        let chart = await controller.chartDieuTri(startDate, endDate);
        let obj = {
            nameArr: [],
            giaArr: []
        }

        for (let i = 0; i < chart.length; i++) {
            obj.nameArr.push("Tháng " + chart[i].month);
            obj.giaArr.push(chart[i].thanhtien);
        }
        response.success(res, "success", { thanhtien: dt[0].thanhtien, soluong: dt[0], bieudo: obj })
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/thongkebanle", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        const banle = await controller.thongKeDoanhThuBanLeTheoNgay(startDate, endDate);
        const chart = await controller.chartBanLe(startDate, endDate);

        let obj = {
            nameArr: [],
            giaArr: []
        }

        for (let i = 0; i < chart.length; i++) {
            obj.nameArr.push("Tháng " + chart[i].month);
            obj.giaArr.push(chart[i].thanhtien);
        }
        response.success(res, "success", { thongke: banle[0], bieudo: obj })
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/thongkecongdichvu", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        console.log(startDate + " " + endDate);
        let result = await controller.thongKeCDVTheoNgay(startDate, endDate);
        result = result.map(item => { return { thongke: item.thongke * 1000, soluong: item.soluong } });
        response.success(res, "success", result[0]);
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/thongkeCDV", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        console.log(startDate + " " + endDate);
        let result = await controller.thongKeCDVTheoNgay(startDate, endDate);
        result = result.map(item => { return { thongke: item.thongke * 1000, soluong: item.soluong } });
        response.success(res, "success", result[0]);
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});



router.get("/chartcongdichvu", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        console.log(startDate + " " + endDate);
        let result = await controller.chartTop3CongDichVu(startDate, endDate, null);
        let result2 = await controller.chartOtherCongDichVu(startDate, endDate);
        response.success(res, "success", [...result, ...result2]);
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});




module.exports = router;