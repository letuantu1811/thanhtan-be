const giong = require('../../database/models/giong');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");
const Chungloai = require('../../database/models/chungloai');

module.exports = {
    create: async(body) => {
        let data = body;
        try {
            return await giong.create({
                ten: data.ten,
                chungloai_id: res.chungloai_id,
                trangthai: 1
            })
        } catch (error) {
            throw new Error()
        }
    },

    update: async(body) => {
        let data = body;
        try {
            return await giong.update({
                ten: data.ten,
                chungloai_id: res.chungloai_id
            }, { where: { id: data.id } })
        } catch (error) {
            throw new Error()
        }
    },

    getOne: async(id) => {
        try {
            return await giong.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new Error()
        }
    },
    // get many congdichvu
    getMany: async(body) => {
        try {
            return await giong.findAll({
                where: {
                    trangthai: 1
                },
                order: [
                    ['ngaytao', 'DESC']
                ]
            })
        } catch (error) {
            throw new Error()
        }
    },
    // disable congdichvu
    disable: async(id) => {
        try {
            return await giong.update({
                trangthai: ENUM.DISABLE
            }, {
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new Error()
        }
    },
    // disable congdichvu
    getAll: async() => {
        try {
            return await giong.findAll({
                include: [{
                    model: Chungloai,
                    where: {
                        trangthai: 1
                    },
                    required: false
                }]
            }, {
                where: {
                    trangthai: 1
                }
            });
        } catch (error) {
            throw new Error()
        }
    }
}