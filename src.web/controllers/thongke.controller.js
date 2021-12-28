const phieudieutri = require('../../database/models/phieudieutri');
const congdichvu = require('../../database/models/congdichvu');
const banle = require('../../database/models/banle');
// const giasuc = require('../../database/models/giasuc');
const { ENUM } = require('../../utils/index');
const { Op, QueryTypes } = require("sequelize");
const sequelize = require("sequelize");



module.exports = {
    thongKeDoanhThuTheoNgay: async(startDate, endDate) => {
        try {
            console.log(startDate + " " + endDate);
            return await phieudieutri.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('thanhtien')), 'thanhtien'], [sequelize.fn('count', sequelize.col('thanhtien')), 'soluong']
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

    thongKeDoanhThuBanLeTheoNgay: async(startDate, endDate) => {
        try {
            console.log(startDate + " " + endDate);
            return await banle.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('tongdonhang')), 'thanhtien'], [sequelize.fn('count', sequelize.col('tongdonhang')), 'soluong']
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

    thongKeCDVTheoNgay: async(startDate, endDate) => {
        try {
            console.log(startDate + " " + endDate);
            return await phieudieutri.sequelize.query(`select sum(c.gia) as thongke, count(c.gia) as soluong from phieudieutri p2 
            left join phieudieutri_congdichvu pc4 on pc4.phieudieutri_id  = p2.id 
            left join congdichvu c on c.id = pc4.congdichvu_id 
            where p2.ngaytao BETWEEN '${startDate}' and '${endDate}'`, { type: QueryTypes.SELECT });
        } catch (error) {
            return error
        }
    },

    chartDieuTri: async(startDate, endDate) => {
        try {
            console.log(startDate + " " + endDate);
            return await phieudieutri.sequelize.query(`
            SELECT
                YEAR(ngaytao) AS year,
                MONTH(ngaytao) AS month,
                SUM(thanhtien) AS thanhtien
            FROM
                phieudieutri
            where
                ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY
                YEAR(ngaytao),
                MONTH(ngaytao)
            `, { type: QueryTypes.SELECT });
        } catch (error) {
            return error
        }
    },

    chartBanLe: async(startDate, endDate) => {
        try {
            console.log(startDate + " " + endDate);
            return await phieudieutri.sequelize.query(`
            SELECT
                YEAR(ngaytao) AS year,
                MONTH(ngaytao) AS month,
                SUM(tongdonhang) AS thanhtien
            FROM
                banle
            where
                ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY
                YEAR(ngaytao),
                MONTH(ngaytao)
            `, { type: QueryTypes.SELECT });
        } catch (error) {
            return error
        }
    },

}