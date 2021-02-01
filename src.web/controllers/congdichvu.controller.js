const congdichvu = require('../../database/models/congdichvu');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");

module.exports = {
    // Creating congdichvu
    // create: async(res) => {
    //     console.log(congdichvu);
    //     try {
    //         return await congdichvu.create({
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
    // Updating congdichvu
    // update: async(res) => {
    //     console.log(congdichvu);
    //     try {
    //         return await congdichvu.update({
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
    // get one congdichvu
    getOne: async(id) => {
        try {
            return await congdichvu.findOne({
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
        let limit = body.limit;
        let offset = body.offset;
        let quyen = body.quyen;
        try {
            return await congdichvu.findAll({
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
    // disable congdichvu
    disable: async(id) => {
        try {
            return await congdichvu.update({
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
    // disable congdichvu
    getAll: async() => {
        try {
            return await congdichvu.findAll();
        } catch (error) {
            return error
        }
    }
}