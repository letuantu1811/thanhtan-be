const phieudieutri = require('../../database/models/phieudieutri');
const congdichvu = require('../../database/models/congdichvu');
const phieudieutri_congdichvu = require('../../database/models/phieudieutri_congdichvu');
const banle = require('../../database/models/banle');
const giasuc = require('../../database/models/giasuc');
const khachhang = require('../../database/models/khachhang');
const { ENUM } = require('../../utils/index');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('sequelize');
const { toNumber } = require('lodash');

module.exports = {
    thongKeDoanhThuTheoNgay: async (startDate, endDate) => {
        try {
            console.log(startDate + ' ' + endDate);
            return await phieudieutri.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('thanhtien')), 'thanhtien'],
                    [sequelize.fn('count', sequelize.col('thanhtien')), 'soluong'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });
        } catch (error) {
            return error;
        }
    },

    thongKeDoanhThuBanLeTheoNgay: async (startDate, endDate) => {
        try {
            console.log(startDate + ' ' + endDate);
            return await banle.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('tongdonhang')), 'thanhtien'],
                    [sequelize.fn('count', sequelize.col('tongdonhang')), 'soluong'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });
        } catch (error) {
            return error;
        }
    },

    thongKeCDVTheoNgay: async (startDate, endDate) => {
        try {
            console.log(startDate + ' ' + endDate);
            return await phieudieutri.sequelize.query(
                `
            select 
                sum(c.gia) as thongke, count(c.gia) as soluong 
            from 
                phieudieutri p2 
                left join phieudieutri_congdichvu pc4 on pc4.phieudieutri_id  = p2.id 
                left join congdichvu c on c.id = pc4.congdichvu_id 
            where 
                p2.ngaytao BETWEEN '${startDate}' and '${endDate}'`,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartDieuTri: async (startDate, endDate) => {
        try {
            console.log(startDate + ' ' + endDate);
            return await phieudieutri.sequelize.query(
                `
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
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartBanLe: async (startDate, endDate) => {
        try {
            console.log(startDate + ' ' + endDate);
            return await phieudieutri.sequelize.query(
                `
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
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartTop3CongDichVu: async (startDate, endDate, id) => {
        try {
            return await phieudieutri_congdichvu.sequelize.query(
                `
            select
                COUNT(p.congdichvu_id) as soluong,
                sum(pc.gia) * 1000 as tongcong,
                pc.ten,
                pc.id
            from
                phieudieutri_congdichvu p
            left join congdichvu pc on
                pc.id = p.congdichvu_id
            left join phieudieutri c2 on
                p.phieudieutri_id = c2.id
            where
                p.ngaytao BETWEEN '${startDate}' AND '${endDate}' ${
                    id !== null ? 'or p.id = ' + id : ''
                }
            group by
                p.congdichvu_id
            order by
                soluong desc
            limit ${id !== null ? 4 : 3}`,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartOtherCongDichVu: async (startDate, endDate) => {
        try {
            return await phieudieutri_congdichvu.sequelize.query(
                `
            select
                sum(a.soluong) as soluong,
                sum(a.tongcong) as tongcong,
                'Khác' as ten,
                0 as id
            from
                (
                select
                    COUNT(p.congdichvu_id) as soluong,
                    sum(pc.gia) * 1000 as tongcong,
                    pc.ten,
                    pc.id
                from
                    phieudieutri_congdichvu p
                left join congdichvu pc on
                    pc.id = p.congdichvu_id
                left join phieudieutri c2 on
                    p.phieudieutri_id = c2.id
                where
                    p.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                group by
                    p.congdichvu_id
                order by
                    soluong desc
                limit 3,
                100000) as a`,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartDieuTriByPayment: async (startDate, endDate) => {
        try {
            return await phieudieutri.sequelize.query(
                `
            SELECT
                SUM(thanhtien) AS thanh_tien,
                COUNT(*) AS so_luong
            FROM
                phieudieutri
            where
                payment_id IN (1, 2, 3)
                AND ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY payment_id
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartDieuTriByType: async (startDate, endDate) => {
        try {
            return await phieudieutri.sequelize.query(
                `
            SELECT
                SUM(thanhtien) AS thanh_tien,
                COUNT(*) AS so_luong
            FROM
                phieudieutri
            where
                typedieutri_id IN (1, 2, 3)
                AND ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY typedieutri_id
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    topProductSeller: async (startDate, endDate) => {
        try {
            return await sanpham.sequelize.query(
            `
            SELECT s.id, s.ten, s.tenthaythe, COUNT(ps.sanpham_id) AS soluong
            FROM
                sanpham AS s
            JOIN phieudieutri_sanpham AS ps ON s.id = ps.sanpham_id
            where
                ps.ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY s.id, s.ten
            ORDER BY soluong DESC
            LIMIT 10;
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    topServiceSeller: async (startDate, endDate) => {
        try {
            return await congdichvu.sequelize.query(
            `
            SELECT c.id, c.ten, COUNT(pc.congdichvu_id) AS soluong
            FROM
                congdichvu AS c
            JOIN phieudieutri_congdichvu AS pc ON c.id = pc.congdichvu_id
            where
                pc.ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY c.id, c.ten
            ORDER BY soluong DESC
            LIMIT 10;
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    totalProductRetail: async (startDate, endDate) => {
        try {
            return await banle.sequelize.query(
            `
            SELECT SUM(bs.soluong) AS tongsoluong
            FROM banle_sanpham AS bs
            WHERE bs.ngaytao BETWEEN '${startDate}' and '${endDate}';
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    topProductRetail: async (startDate, endDate) => {
        try {
            return await banle.sequelize.query(
            `
            SELECT s.id, s.ten, s.tenthaythe,
                   COUNT(bs.sanpham_id) AS soluongdon,
                   SUM(bs.soluong) AS soluong,
                   SUM(bs.soluong * bs.dongiaban - bs.discountAmount) AS tongtien
            FROM
                sanpham AS s
            JOIN banle_sanpham AS bs ON s.id = bs.sanpham_id
            where
                bs.ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY s.id, s.ten
            ORDER BY soluongdon DESC
            LIMIT 10;
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    topStaffRetail: async (startDate, endDate) => {
        try {
            return await banle.sequelize.query(
            `
            SELECT tv.id, tv.tendaydu,
                   COUNT(bl.nguoitao_id) AS soluongdon,
                   SUM(bl.tongdonhang - bl.discountAmount) AS tongtien
            FROM
                thanhvien AS tv
            JOIN banle AS bl ON tv.id = bl.nguoitao_id
            where
                bl.ngaytao BETWEEN '${startDate}' and '${endDate}' 
            GROUP BY tv.id
            ORDER BY soluongdon DESC
            LIMIT 10;
            `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    getPhieuDieuTri: async (pageSize, pageNum, startDate, endDate, typeDieutrId) => {
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;

        try {
            const defaultIncludes = [
                { 
                    model: giasuc,
                    as: 'giasuc'
                },
                { 
                    model: khachhang, 
                    as: 'khachhang'
                },
            ];

            const currentDateTreatments = await phieudieutri.findAll({
                include: [...defaultIncludes],
                where: {
                    trangthai: 1,
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                    typedieutri_id: typeDieutrId
                },
                order: [['ngaytao', 'DESC']],
                limit,
                offset
            });

            const total = await phieudieutri.count({
                include: [...defaultIncludes],
                where: {
                    trangthai: 1,
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                    typedieutri_id: typeDieutrId
                }
            });

            const totalItems = total; 
            const totalPages = Math.ceil(totalItems / pageSize);
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            }; 

            const data = currentDateTreatments.map((treetMent) => {
                const rawTreetMent = treetMent.toJSON();
                const discountAmount = toNumber(rawTreetMent.discountAmount) || 0;
                const addedDiscountAmount = toNumber(rawTreetMent.addedDiscountAmount) || 0;
                const thanhtien = toNumber(rawTreetMent.thanhtien) || 0;

                const orginTotalAmount =
                    (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);

                const reCalculateAmountExamForm = {
                    ...rawTreetMent,
                    discountAmount: 0,
                    addedDiscountAmount: 0,
                    thanhtien: orginTotalAmount,
                };
                return reCalculateAmountExamForm;
            });
            return { data, pagination };
        } catch (error) {
            return error;
        }
    }
};
