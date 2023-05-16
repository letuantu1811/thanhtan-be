const nhomsanpham = require('../../database/models/nhomsanpham');
const phieudieutri = require('../../database/models/phieudieutri');
const sanpham = require('../../database/models/sanpham');
const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op } = require('sequelize');
const { localDate } = require('../../utils/localDate');

module.exports = {
    // get hsba sử dụng Rabisin (dại) id 261
    getExaminationWithRabisin: async (role) => {
        try {
            return await phieudieutri.findAll({
                include: [
                    {
                        model: giasuc,
                    },
                    {
                        model: sanpham,
                        where: {
                            id: 261,
                        },
                        require: true,
                    },
                ],
                where: {
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    getExaminationWithMedicinName: async (id) => {
        let object = {};
        if (id !== 'null') {
            object = {
                where: {
                    id: id,
                },
            };
        }
        try {
            return await phieudieutri.findAll({
                include: [
                    {
                        model: giasuc,
                    },
                    {
                        model: sanpham,
                        ...object,
                        require: true,
                    },
                ],
                where: {
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
};
