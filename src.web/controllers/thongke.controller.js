const phieudieutri = require('../../database/models/phieudieutri');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op } = require("sequelize");
const sequelize = require("sequelize");

module.exports = {
    thongKeDoanhThuTheoNgay: async(startDate, endDate) => {
        try {
            console.log(startDate + " " + endDate);
            return await phieudieutri.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('thanhtien')), 'thanhtien'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            })
        } catch (error) {
            return error
        }
    },

}