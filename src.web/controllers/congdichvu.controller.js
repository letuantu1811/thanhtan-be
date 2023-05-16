const congdichvu = require('../../database/models/congdichvu');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require('sequelize');
const { localDate } = require('../../utils/localDate');

module.exports = {
    // Creating congdichvu
    create: async (res) => {
        console.log(congdichvu);
        try {
            return await congdichvu.create({
                ngaytao: localDate(new Date()),
                ten: res.ten,
                gia: res.gia,
                trangthai: 1,
            });
        } catch (error) {
            return error;
        }
    },
    // Updating congdichvu
    update: async (res) => {
        console.log(congdichvu);
        try {
            return await congdichvu.update(
                {
                    ten: res.ten,
                    gia: res.gia,
                    trangthai: res.trangthai,
                },
                {
                    where: {
                        id: res.id,
                    },
                },
            );
        } catch (error) {
            return error;
        }
    },
    // get one congdichvu
    getOne: async (id) => {
        try {
            return await congdichvu.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            return error;
        }
    },
    // get many congdichvu
    getMany: async (body) => {
        try {
            return await congdichvu.findAll({
                // where: {
                // trangthai: quyen == "admin" ? "" : 1
                // },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            return error;
        }
    },
    // disable congdichvu
    disable: async (id) => {
        try {
            return await congdichvu.update(
                {
                    trangthai: ENUM.DISABLE,
                },
                {
                    where: {
                        id: id,
                    },
                },
            );
        } catch (error) {
            return error;
        }
    },
    // disable congdichvu
    getAll: async () => {
        try {
            return await congdichvu.findAll({
                where: {
                    trangthai: 1,
                },
            });
        } catch (error) {
            return error;
        }
    },
};
