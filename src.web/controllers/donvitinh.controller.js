const donvitinh = require('../../database/models/donvitinh');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");

module.exports = {
    // Creating donvitinh
    // create: async(res) => {
    //     console.log(donvitinh);
    //     try {
    //         return await donvitinh.create({
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
    // Updating donvitinh
    // update: async(res) => {
    //     console.log(donvitinh);
    //     try {
    //         return await donvitinh.update({
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
    // get one donvitinh
    getOne: async(id) => {
        try {
            return await donvitinh.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many donvitinh
    getMany: async(body) => {
        let limit = body.limit;
        let offset = body.offset;
        let quyen = body.quyen;
        try {
            return await donvitinh.findAll({
                where: {
                    trangthai: quyen == "admin" ? "" : 1
                },
                order: [
                    ['ngaytao', 'DESC']
                ]
            })
        } catch (error) {
            return error
        }
    },
    // disable donvitinh
    disable: async(id) => {
        try {
            return await donvitinh.update({
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
    // disable donvitinh
    getAll: async() => {
        try {
            return await donvitinh.findAll();
        } catch (error) {
            return error
        }
    }
}