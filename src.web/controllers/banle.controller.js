// const model = require('../../database/models/model');
const model = require('../../database/models/banle');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");
const sanpham = require('../../database/models/sanpham');
const Donvitinh = require('../../database/models/donvitinh');
const BL_SP = require('../../database/models/banle_sanpham');
const khachhang = require('../../database/models/khachhang');
const Thanhvien = require('../../database/models/thanhvien');
const { localDate } = require('../../utils/localDate');
const OrderService = require('../services/OrderService');

module.exports = {
    getOne: async(id) => {
        try {
            return await model.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many congdichvu
    getMany: async(body) => {
        try {
            return await model.findAll({
                where: {
                    trangthai: 1
                },
                order: [
                    ['ngaytao', 'DESC']
                ]
            })
        } catch (error) {
            return error
        }
    },
    // disable congdichvu
    disable: async(id) => {
        try {
            return await model.update({
                trangthai: ENUM.DISABLE
            }, {
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // disable congdichvu
    getAll: async() => {
        try {
            return await model.findAll({
                include: [{
                    model: sanpham,
                    as: 'sanpham',
                    include: {
                        model: Donvitinh,
                        as: "donvitinh"
                    }
                }, {
                    model: khachhang,
                    as: 'khachhang'
                }, {
                    attributes: { exclude: ['matkhau'] },
                    model: Thanhvien,
                    as: 'nguoiban'
                }],
                order: [
                    ['ngaytao', 'DESC']
                ],
                where: {
                    trangthai: ENUM.ENABLE
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    // disable congdichvu
    createOrders: async(body) => {
        try {
            let date = localDate(new Date());
            let banleID = await model.create({
                ngaytao: date,
                ten: body.ten,
                ghichu: body.ghichu,
                nguoitao_id: body.nguoitao_id,
                trangthai: 1,
                tylegiamgia: body.tylegiamgia,
                tongdonhang: body.tongdonhang
            }).then(async res => {
                return res.dataValues.id;
            })
            console.log(banleID);
            let arr = [];
            if (body.listSP.length < 1) {
                throw new Error()
            }
            for (let index = 0; index < body.listSP.length; index++) {
                const element = body.listSP[index];
                let obj = {
                    banle_id: 0,
                    sanpham_id: 0,
                    soluong: 0,
                    dongiaban: 0
                }
                obj = new Object();
                obj.banle_id = banleID;
                obj.sanpham_id = element.id;
                obj.soluong = element.soluong;
                obj.dongiaban = element.dongiaban;
                let soluongconlai = Number.parseInt(element.soluongcon) - Number.parseInt(element.soluong);
                await sanpham.update({ soluong: soluongconlai < 0 ? 0 : soluongconlai }, {
                    where: {
                        id: element.id
                    }
                });
                arr.push(obj);
            }
            await BL_SP.bulkCreate(arr).then(res => {
                return res;
            });
        } catch (error) {
            return error
        }
    },
    printOrder: async() => {
        return await OrderService.getInvoiceTemplate();
    }
}