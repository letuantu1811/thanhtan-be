const khachhang = require('../../database/models/khachhang');
const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");

module.exports = {
    // Creating khachhang
    // create: async(res) => {
    //     console.log(khachhang);
    //     try {
    //         return await khachhang.create({
    //             name: res.name,
    //             email: res.email,
    //             category_id: res.category_id,
    //             phone_number: res.phone_number,
    //             state: ENUM.PENDING
    //         })
    //     } catch (error) {
    //         return error
    //     }

    // },
    // Updating khachhang
    // update: async(res) => {
    //     console.log(khachhang);
    //     try {
    //         return await khachhang.update({
    //             name: res.name,
    //             email: res.email,
    //             category_id: res.category_id,
    //             phone_number: res.phone_number
    //         }, {
    //             where: {
    //                 id: res.id
    //             }
    //         })
    //     } catch (error) {
    //         return error
    //     }

    // },
    // get one khachhang
    getOne: async(id) => {
        try {
            return await khachhang.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many khach hang
    getMany: async(body) => {
        let limit = body.limit;
        let offset = body.offset;
        let quyen = body.quyen;
        try {
            return await khachhang.findAll({
                include: [{
                    model: giasuc,
                    as: 'giasuc',
                    where: {
                        trangthai: true
                    }
                }],
                where: {
                    trangthai: quyen == "admin" ? "" : 1
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
    // disable khachhang
    disable: async(id) => {
        try {
            return await khachhang.update({
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
    // disable khachhang
    getAll: async() => {
        try {
            return await khachhang.findAll();
        } catch (error) {
            return error
        }
    }
}