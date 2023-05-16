const { ENUM } = require('../../utils/index');
const { Op } = require('sequelize');
const nhomkhachhang = require('../../database/models/nhomkhachhang');
const { localDate } = require('../../utils/localDate');

module.exports = {
    // Creating sanpham
    create: async (res) => {
        try {
            return await nhomkhachhang.create({
                ngaytao: localDate(new Date()),
                ten: res.ten,
                tylegiamgia: res.tylegiamgia,
            });
        } catch (error) {
            return error;
        }
    },
    // Updating sanpham
    update: async (res) => {
        try {
            return await nhomkhachhang.update(
                {
                    ten: res.ten,
                    tylegiamgia: res.tylegiamgia,
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
    // get many san pham
    getMany: async (id) => {
        try {
            return await nhomkhachhang.findAll({
                where: {
                    trangthai: ENUM.ENABLE,
                },
            });
        } catch (error) {
            return error;
        }
    },
    // disable sanpham
    disable: async (id) => {
        try {
            return await nhomkhachhang.update(
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
};
