const chungloai = require('../../database/models/chungloai');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, where } = require('sequelize');
const { localDate } = require('../../utils/localDate');

module.exports = {
    create: async (body) => {
        const data = body;
        try {
            return await chungloai.create({
                ngaytao: localDate(new Date()),
                ten: data.ten,
                trangthai: 1,
            });
        } catch (error) {
            return error;
        }
    },

    update: async (body) => {
        const data = body;
        try {
            return await chungloai.update(
                { ten: data.ten, trangthai: data.trangthai },
                { where: { id: data.id } },
            );
        } catch (error) {
            return error;
        }
    },

    getOne: async (id) => {
        try {
            return await chungloai.findOne({
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
            return await chungloai.findAll({
                where: {
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            return error;
        }
    },
    // disable congdichvu
    disable: async (id) => {
        try {
            return await chungloai.update(
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
            return await chungloai.findAll({
                where: {
                    trangthai: 1,
                },
            });
        } catch (error) {
            return error;
        }
    },
};
