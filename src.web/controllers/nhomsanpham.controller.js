const nhomsanpham = require('../../database/models/nhomsanpham');
const { ENUM } = require('../../utils/index');
const { Op } = require("sequelize");
const sanpham = require('../../database/models/sanpham');
const { localDate } = require('../../utils/localDate');

module.exports = {
    // Creating sanpham
    create: async(res) => {
        try {
            return await nhomsanpham.create({
                ngaytao: localDate(new Date()),
                ten: res.ten,
                nguoitao_id: 1,
                trangthai: 1
            })
        } catch (error) {
            return error
        }

    },
    // Updating sanpham
    update: async(res) => {
        try {
            return await nhomsanpham.update({
                ten: res.ten,
                trangthai: 1,
                nguoitao_id: 1
            }, {
                where: {
                    id: res.id
                }
            })
        } catch (error) {
            throw new Error();
        }

    },
    // get one sanpham
    getOne: async(id) => {
        try {
            return await sanpham.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many san pham
    getMany: async(id) => {
        try {
            return await nhomsanpham.findAll({
                include: [{
                    model: sanpham,
                    trangthai: 1
                }],
                where: {
                    id: id,
                    trangthai: ENUM.ENABLE
                },
                order: [
                    ['ngaytao', 'DESC']
                ]
            })
        } catch (error) {
            return error
        }
    },
    // disable sanpham
    disable: async(id) => {
        try {
            return await nhomsanpham.update({
                trangthai: 0
            }, {
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many san pham
    getAll: async() => {
        // let nhomsanpham_id = body.nhomsanpham_id || "";
        try {
            return await nhomsanpham.findAll({
                where: {
                    trangthai: ENUM.ENABLE
                },
                order: [
                    ['ngaytao', 'DESC']
                ]
            })
        } catch (error) {
            return error
        }
    }
}