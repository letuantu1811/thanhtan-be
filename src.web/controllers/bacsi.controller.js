const bacsi = require('../../database/models/bacsi');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");

module.exports = {
    getOne: async(id) => {
        try {
            return await bacsi.findOne({
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
            return await bacsi.findAll({
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
            return await bacsi.update({
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
            return await bacsi.findAll();
        } catch (error) {
            return error
        }
    }
}