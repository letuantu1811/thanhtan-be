const express = require("express");
const router = express.Router();;
const response = require('../../utils/api.res/response');
const auth = require("../../middlewares/auth.middleware");
const sanpham = require('../../database/models/sanpham');
const phieudieutri = require("../../database/models/phieudieutri");
const Thanhvien = require("../../database/models/thanhvien");
const Donvitinh = require("../../database/models/donvitinh");
const Nhomsanpham = require("../../database/models/nhomsanpham");

router.get("/", async(req, res) => {
    try {
        const result = await sanpham.findAll({
            include: [{
                    attributes: ['id', 'ten'],
                    model: Donvitinh
                },
                {
                    attributes: ['id', 'ten'],
                    model: Nhomsanpham
                }
            ],
            where: {
                an: 1
            }
        })
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
router.get("/shows", async(req, res) => {
    try {
        const result = await sanpham.findAll({
            attributes: ['id', 'ten', 'tenthaythe', 'an'],
            where: {
                an: 0
            }
        })
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.get("/totalExam", async(req, res) => {
    try {
        const tongphieudieutri = await phieudieutri.count();
        const sohienthi = await Thanhvien.findOne({
            attributes: ['config'],
        }, {
            where: {
                id: 1
            }
        });
        let result = {
            tongphieudieutri: tongphieudieutri,
            sohienthi: sohienthi.config
        }
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

// thêm vào list ẩn
router.put("/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await sanpham.update({
            an: 1
        }, {
            where: {
                id: id
            },
        });
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});
// thêm vào list ẩn
router.put("/show/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await sanpham.update({
            an: 0
        }, {
            where: {
                id: id
            },
        });
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

router.post("/:count", async(req, res) => {
    let count = req.params.count;
    try {
        const result = await Thanhvien.update({
            config: count
        }, {
            where: {
                id: 1
            },
        });
        console.log(result);
        response.success(res, "success", result)
    } catch (err) {
        console.log(err.message);
        response.error(res, "failed", 500)
    }
});

module.exports = router;