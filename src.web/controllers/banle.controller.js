// const model = require('../../database/models/model');
const model = require('../../database/models/banle');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");
const sanpham = require('../../database/models/sanpham');
const Donvitinh = require('../../database/models/donvitinh');
const BL_SP = require('../../database/models/banle_sanpham');

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
                        model: Donvitinh
                    }
                }]
            });
        } catch (error) {
            return error
        }
    },
    // disable congdichvu
    createOrders: async(body) => {
        try {
            let banleID = await model.create({
                ten: body.ten,
                khachhang_id: body.khachhang_id,
                nguoitao_id: body.nguoitao_id,
                trangthai: 1,
                tylegiamgia: body.tylegiamgia,
                tongdonhang: body.tongdonhang
            }).then(async res => {
                return res.dataValues.id;
            })
            console.log(banleID);
            let arr = [];
            for (let index = 0; index < body.listSP.length; index++) {
                const element = body.listSP[index];
                let obj = {
                    banle_id: 0,
                    sanpham_id: 0
                }
                obj = new Object();
                obj.banle_id = banleID;
                obj.sanpham_id = element.id;
                arr.push(obj);
            }
            await BL_SP.bulkCreate(arr).then(res => {
                return res;
            });
        } catch (error) {
            return error
        }
    }
}