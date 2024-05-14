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
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    try {
        const result = await controller.getPhieuDieuTri(pageSize, pageNum, startDate, endDate, typeDieutrId);
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get("/thongkenhanvien", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let empID = req.query.empID;

        if (startDate && endDate) {
            startDate = moment(startDate).format('YYYY-MM-DD');
            endDate = moment(endDate).format('YYYY-MM-DD');
        }

        let dt_dieutri = await controller.thongKeDoanhThuNhanVienTheoNgay(startDate, endDate, empID);        
        const dt_banle = await controller.thongKeDoanhThuBanLeNhanVienTheoNgay(startDate, endDate, empID);

        response.success(res, "success", 
        { 
            dieutri: dt_dieutri[0],
            banle: dt_banle[0]
            
        })
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/chartnhanvien", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        let empID = req.query.empID;

        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        let arr1 = await controller.thongKeBanLeTheoNhanVien(startDate, endDate, empID);
        let arr2 = await controller.thongKePhieuDieuTriTheoNhanVien(startDate, endDate, empID);

        const arr2Map = {};
        arr2.forEach(item => {
            arr2Map[item.id] = item;
        });

        const mergedArray = arr1.map(item1 => {
            const matchingItem = arr2Map[item1.id];
            if (matchingItem) {
                return {
                    id: item1.id,
                    tendaydu: item1.tendaydu,
                    total_banle: item1.total_banle,
                    total_phieudieutri: matchingItem.total_phieudieutri,
                    total: parseInt(matchingItem.total_phieudieutri || 0) +  item1.total_banle,
                };
            } else {
                return {
                    id: item1.id,
                    tendaydu: item1.tendaydu,
                    total_banle: item1.total_banle,
                    total_phieudieutri: 0,
                    total: item1.total_banle
                }; 
            }
        });
        response.success(res, "success", mergedArray);      
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/thongkekhachhang", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let customerID = req.query.customerID;

        if (startDate && endDate) {
            startDate = moment(startDate).format('YYYY-MM-DD');
            endDate = moment(endDate).format('YYYY-MM-DD');
        }

        const dt_dieutri = await controller.khachHangPhieuDieuTri(startDate, endDate, customerID);        
        const dt_banle = await controller.khachHangBanLe(startDate, endDate, customerID);

        response.success(res, "success", 
        { 
            dieutri: dt_dieutri[0],
            banle: dt_banle[0]
            
        })
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/topkhachhangbanle", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const pageSize = parseInt(req.query.pageSize) || 10;

        let result = await controller.topKhachHangBanLe(startDate, endDate, pageSize);
        response.success(res, "success", result);      
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/topkhachhangphieudieutri", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const pageSize = parseInt(req.query.pageSize) || 10;

        let result = await controller.topKhachHangPhieuDieuTri(startDate, endDate, pageSize);
        response.success(res, "success", result);      
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/danhsachkhachhangphieudieutri", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pageNum = parseInt(req.query.pageNum) || 1;
        let customerID = req.query.customerID || null;     

        let result = await controller.danhSachThongKeKhachHangPhieuDieuTri(startDate, endDate, pageSize, pageNum, customerID);
        const pagination = {
            totalPages: Math.ceil(result.total[0].totalResults / pageSize),
            currentPage: pageNum,
            pageSize,
            totalItems: result.total[0].totalResults,
        }; 
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, pagination);   
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/danhsachkhachhangbanle", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pageNum = parseInt(req.query.pageNum) || 1;
        let customerID = req.query.customerID || null;     

        let result = await controller.danhSachThongKeKhachHangBanLe(startDate, endDate, pageSize, pageNum, customerID);

        const pagination = {
            totalPages: Math.ceil(result.total[0].totalResults / pageSize),
            currentPage: pageNum,
            pageSize,
            totalItems: result.total[0].totalResults,
        }; 
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, pagination);   
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/thongkesanpham", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let nhomSanPhamId = req.query.nhomSanPhamId;
        let sanPhamId = req.query.sanPhamId;

        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        let dt_dieutri = await controller.thongkeSanPhamPhieuDieuTri(startDate, endDate, nhomSanPhamId, sanPhamId);
        const dt_banle = await controller.thongkeSanPhamBanLe(startDate, endDate, nhomSanPhamId, sanPhamId);

        response.success(res, "success", 
        { 
            dieutri: dt_dieutri[0],
            banle: dt_banle[0]
            
        })
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/chartsanpham", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const pageSize = parseInt(req.query.pageSize) || 10;

        let chart_dieutri = await controller.chartSanPhamDieuTri(startDate, endDate, pageSize, 1);
        let chart_banle = await controller.chartSanPhamBanLe(startDate, endDate, pageSize, 1);

        response.success(res, "success", 
        { 
            dieutri: chart_dieutri.data,
            banle: chart_banle.data
            
        })

    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get('/listsanphamphieudieutri', async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if (startDate && endDate) {
        startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    try {
        const result = await controller.chartSanPhamDieuTri(startDate, endDate, pageSize, pageNum );
        const pagination = {
            totalPages: Math.ceil(result.total[0].totalResults / pageSize),
            currentPage: pageNum,
            pageSize,
            totalItems: result.total[0].totalResults,
        }; 
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/listsanphambanle', async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if (startDate && endDate) {
        startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    try {
        const result = await controller.chartSanPhamBanLe(startDate, endDate, pageSize, pageNum );
        const pagination = {
            totalPages: Math.ceil(result.total[0].totalResults / pageSize),
            currentPage: pageNum,
            pageSize,
            totalItems: result.total[0].totalResults,
        }; 
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get("/tongquancongdichvu", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let cdvID = req.query.cdvID;

        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        let result = await controller.thongkeCongDichVu(startDate, endDate, cdvID);
        if (result[0].tong_tien) result[0].tong_tien = result[0].tong_tien * 1000;

        response.success(res, "success", result);
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/chartcdv", async(req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;     
        if (startDate && endDate) {
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        const pageSize = parseInt(req.query.pageSize) || 10;

        let result = await controller.chartCongDichVu(startDate, endDate, pageSize, 1);

        response.success(res, "success", result.data)

    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get('/listcdv', async (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if (startDate && endDate) {
        startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    try {
        const result = await controller.chartCongDichVu(startDate, endDate, pageSize, pageNum );
        const pagination = {
            totalPages: Math.ceil(result.total[0].totalResults / pageSize),
            currentPage: pageNum,
            pageSize,
            totalItems: result.total[0].totalResults,
        }; 
        response.success_v2(res, 'Lấy dữ liệu thành công', result.data, pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

module.exports = router;