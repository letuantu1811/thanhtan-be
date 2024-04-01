const express = require("express");
const router = express.Router();
const controller = require("../../src.web/controllers/thongke.controller");
const response = require('../../utils/api.res/response');
const moment = require('moment');

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

router.get("/thongkedoanhthu", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (startDate && endDate) {
            startDate = moment(startDate).format('YYYY-MM-DD');
            endDate = moment(endDate).format('YYYY-MM-DD');
        }

        let dt_dieutri = await controller.thongKeDoanhThuTheoNgay(startDate, endDate);
        let chart_dieutri = await controller.chartDieuTri(startDate, endDate);
        
        const dt_banle = await controller.thongKeDoanhThuBanLeTheoNgay(startDate, endDate);
        const chart_banle = await controller.chartBanLe(startDate, endDate);

        let obj_dieutri = {
            thang: [],
            tong_tien_theo_thang: []
        }
        for (let i = 0; i < chart_dieutri.length; i++) {
            obj_dieutri.thang.push("Tháng " + chart_dieutri[i].month);
            obj_dieutri.tong_tien_theo_thang.push(chart_dieutri[i].thanhtien);
        }

        let obj_banle = {
            thang: [],
            tong_tien_theo_thang: []
        }
        for (let i = 0; i < chart_banle.length; i++) {
            obj_banle.thang.push("Tháng " + chart_banle[i].month);
            obj_banle.tong_tien_theo_thang.push(chart_banle[i].thanhtien);
        }
        response.success(res, "success", 
        { 
            doanh_thu: 
            { 
                dieutri: dt_dieutri[0],
                banle: dt_banle[0]
            }, 
            bieudo: {
                dieutri: obj_dieutri,
                banle: obj_banle
            } 
        })
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/dieutribypayment", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const obj_null = {
            thanh_thien: '0',
            so_luong: 0
        }
        let result = await controller.chartDieuTriByPayment(startDate, endDate);
        response.success(res, "success", 
        {
            tien_mat: result[0] ? result [0] : obj_null,
            chuyen_khoan: result[1] ? result [1] : obj_null,
            cong_no: result[2] ? result [2] : obj_null
        });
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/dieutribytype", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const obj_null = {
            thanh_thien: '0',
            so_luong: 0
        }
        let result = await controller.chartDieuTriByType(startDate, endDate);
        response.success(res, "success", 
        {
            ngoai_tru: result[0] ? result [0] : obj_null,
            noi_tru: result[1] ? result [1] : obj_null,
            tai_nha: result[2] ? result [2] : obj_null
        });
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/topproductseller", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        let result = await controller.topProductSeller(startDate, endDate);
        response.success(res, "success", result);      
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/topserviceseller", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        let result = await controller.topServiceSeller(startDate, endDate);
        response.success(res, "success", result);       
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/toproductretail", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        let total = await controller.totalProductRetail(startDate, endDate);
        let result = await controller.topProductRetail(startDate, endDate);
        response.success(res, "success", { tongsoluong: total[0].tongsoluong ?? 0, listproduct: result });       
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/topstaffretail", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        let result = await controller.topStaffRetail(startDate, endDate);
        response.success(res, "success", result);      
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get('/phieudieutri', async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let typeDieutrId = parseInt(req.query.typeDieutrId) || 1;     
    if (startDate && endDate) {
        startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    const pageSize = parseInt(req.query.pageSize) || 1;
    const pageNum = parseInt(req.query.pageNum) || 1;
    try {
        const result = await controller.getPhieuDieuTri(pageSize, pageNum, startDate, endDate, typeDieutrId);
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});


module.exports = router;