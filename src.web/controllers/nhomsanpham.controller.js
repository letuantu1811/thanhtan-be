const nhomsanpham = require('../../database/models/nhomsanpham');
const { ENUM } = require('../../utils/index');
const { Op } = require("sequelize");

module.exports = {
    // Creating sanpham
    create: async(res) => {
        try {
            return await nhomsanpham.create({
                ten: res.name,
                nguoitao_id: res.user_id,
                trangthai: res.state
            })
        } catch (error) {
            return error
        }

    },
    // Updating sanpham
    update: async(res) => {
        try {
            return await nhomsanpham.update({
                ten: res.name,
                trangthai: res.state,
                nguoitao_id: res.user_id
            }, {
                where: {
                    id: res.id
                }
            })
        } catch (error) {
            return error
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
    getMany: async(body) => {
        let limit = body.limit;
        let offset = body.offset;
        let quyen = body.quyen;
        let nhomsanpham_id = body.nhomsanpham_id || "";
        try {
            return await nhomsanpham.findAll({
                where: {
                    nhomsanpham_id: nhomsanpham_id,
                    state: quyen == "admin" ? "" : ENUM.ENABLE
                },
                order: [
                    ['ngaytao', 'DESC']
                ],
                offset: offset,
                limit: limit
            })
        } catch (error) {
            return error
        }
    },
    // disable sanpham
    disable: async(id) => {
        try {
            return await nhomsanpham.update({
                state: ENUM.DISABLE
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