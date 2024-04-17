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
            `WITH RECURSIVE months AS (
                SELECT '${startDate}' AS month_date
                UNION ALL
                SELECT DATE_FORMAT(DATE_ADD(month_date, INTERVAL 1 MONTH), '%Y-%m-01')
                FROM months
                WHERE month_date < '${endDate}'
              )
              SELECT
                YEAR(m.month_date) AS year,
                MONTH(m.month_date) AS month,
                COALESCE(SUM(pd.thanhtien), 0) AS thanhtien
              FROM
                months m
              LEFT JOIN
                phieudieutri pd ON YEAR(pd.ngaytao) = YEAR(m.month_date) AND MONTH(pd.ngaytao) = MONTH(m.month_date)
              GROUP BY
                YEAR(m.month_date),
                MONTH(m.month_date)
              ORDER BY
                YEAR(m.month_date),
                MONTH(m.month_date);
              `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartBanLe: async (startDate, endDate) => {
        try {
            return await phieudieutri.sequelize.query(
            `WITH RECURSIVE months AS (
                SELECT '${startDate}' AS month_date
                UNION ALL
                SELECT DATE_FORMAT(DATE_ADD(month_date, INTERVAL 1 MONTH), '%Y-%m-01')
                FROM months
                WHERE month_date < '${endDate}'
              )
              SELECT
                YEAR(m.month_date) AS year,
                MONTH(m.month_date) AS month,
                COALESCE(SUM(bl.tongdonhang), 0) AS thanhtien
              FROM
                months m
              LEFT JOIN
                banle bl ON YEAR(bl.ngaytao) = YEAR(m.month_date) AND MONTH(bl.ngaytao) = MONTH(m.month_date)
              GROUP BY
                YEAR(m.month_date),
                MONTH(m.month_date)
              ORDER BY
                YEAR(m.month_date),
                MONTH(m.month_date);              
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
            return await phieudieutri.sequelize.query(
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
                AND bl.trangthai = 1
                AND tv.trangthai = 1
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
    },
    thongKeDoanhThuNhanVienTheoNgay: async (startDate, endDate, empID) => {
        try {
            let obj = {};
            if (empID) {
                obj.nguoitao_id = parseInt(empID)            
            }
            return await phieudieutri.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('thanhtien')), 'thanhtien'],
                    [sequelize.fn('count', sequelize.col('thanhtien')), 'soluong'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                    trangthai: 1,
                    ...obj
                },
            });
        } catch (error) {
            return error;
        }
    },
    thongKeDoanhThuBanLeNhanVienTheoNgay: async (startDate, endDate, empID) => {
        try {
            let obj = {};
            if (empID) {
                obj.nguoitao_id = parseInt(empID)
            }
            return await banle.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('tongdonhang')), 'thanhtien'],
                    [sequelize.fn('count', sequelize.col('tongdonhang')), 'soluong'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                    trangthai: 1,
                    ...obj
                },
            });
        } catch (error) {
            return error;
        }
    },

    thongKeBanLeTheoNhanVien: async (startDate, endDate) => {
        try {
            return await banle.sequelize.query(
            `
            SELECT
                thanhvien.id,
                thanhvien.tendaydu,
                SUM(banle.tongdonhang - banle.discountAmount) AS total_banle
            FROM
                thanhvien
            LEFT JOIN
                banle ON thanhvien.id = banle.nguoitao_id
            WHERE
                banle.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                AND banle.trangthai = 1
                AND thanhvien.trangthai = 1
            GROUP BY
                thanhvien.id, thanhvien.tendaydu;
                `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    thongKePhieuDieuTriTheoNhanVien: async (startDate, endDate) => {
        try {
            return await phieudieutri.sequelize.query(
            `
            SELECT
                thanhvien.id,
                thanhvien.tendaydu,
                SUM(phieudieutri.thanhtien) AS total_phieudieutri
            FROM
                thanhvien
            LEFT JOIN
                phieudieutri ON thanhvien.id = phieudieutri.nguoitao_id
            WHERE
                phieudieutri.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                AND phieudieutri.trangthai = 1
                AND thanhvien.trangthai = 1
            GROUP BY
                thanhvien.id, thanhvien.tendaydu;
                `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    khachHangPhieuDieuTri: async (startDate, endDate, customerID) => {
        try {
            let obj = {};
            if (customerID) {
                obj.khachhang_id = parseInt(customerID)            
            }
            return await phieudieutri.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('thanhtien')), 'thanhtien'],
                    [sequelize.fn('count', sequelize.col('thanhtien')), 'soluong'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                    trangthai: 1,
                    ...obj
                },
            });
        } catch (error) {
            return error;
        }
    },

    khachHangBanLe: async (startDate, endDate, customerID) => {
        try {
            let obj = {};
            if (customerID) {
                obj.khachhang_id = parseInt(customerID)
            }
            return await banle.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('tongdonhang')), 'thanhtien'],
                    [sequelize.fn('count', sequelize.col('tongdonhang')), 'soluong'],
                ],
                where: {
                    ngaytao: {
                        [Op.between]: [startDate, endDate],
                    },
                    trangthai: 1,
                    ...obj
                },
            });
        } catch (error) {
            return error;
        }
    },

    topKhachHangPhieuDieuTri: async (startDate, endDate) => {
        try {
            return await phieudieutri.sequelize.query(
            `
            SELECT
                khachhang.id,
                khachhang.ten,
                khachhang.sodienthoai,
                SUM(phieudieutri.thanhtien) AS total_thanhtien,
                COUNT(phieudieutri.id) as soluong
            FROM
                khachhang
            JOIN
                phieudieutri ON khachhang.id = phieudieutri.khachhang_id
            WHERE
                phieudieutri.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                AND phieudieutri.trangthai = 1
                AND khachhang.trangthai = 1 
            GROUP BY
                khachhang.id, khachhang.ten, khachhang.sodienthoai
            ORDER BY
                total_thanhtien DESC
            LIMIT
                10;
                `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    topKhachHangBanLe: async (startDate, endDate) => {
        try {
            return await banle.sequelize.query(
            `
            SELECT
                khachhang.id,
                khachhang.ten,
                khachhang.sodienthoai,
                SUM(banle.tongdonhang - banle.discountAmount) AS total_banle,
                COUNT(banle.id) as soluong
            FROM
                khachhang
            JOIN
                banle ON khachhang.id = banle.khachhang_id
            WHERE
                banle.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                AND banle.trangthai = 1
                AND khachhang.trangthai = 1 
            GROUP BY
                khachhang.id, khachhang.ten, khachhang.sodienthoai
            ORDER BY
                total_banle DESC
            LIMIT
                10;
                `,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    danhSachThongKeKhachHangPhieuDieuTri: async (startDate, endDate, pageSize, pageNum, customerID) => {
        try {
            let str = '';
            if (customerID) {
                str = `AND khachhang.id = ${customerID}`;
            }
            const data = await phieudieutri.sequelize.query(
            `
            SELECT
                khachhang.id,
                khachhang.ten,
                khachhang.sodienthoai,
                SUM(phieudieutri.thanhtien) AS total_thanhtien,
                COUNT(phieudieutri.id) as soluong
            FROM
                khachhang
            JOIN
                phieudieutri ON khachhang.id = phieudieutri.khachhang_id
            WHERE
                phieudieutri.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                AND phieudieutri.trangthai = 1
                AND khachhang.trangthai = 1
                ${str}
            GROUP BY
                khachhang.id, khachhang.ten, khachhang.sodienthoai
            ORDER BY
                total_thanhtien DESC
            LIMIT ${pageSize} OFFSET ${pageSize * (pageNum - 1)};
            `,
                { type: QueryTypes.SELECT },
            );

            const total = await phieudieutri.sequelize.query(
                `
                SELECT COUNT(*) AS totalResults
                FROM (
                    SELECT
                        khachhang.id,
                        khachhang.ten,
                        khachhang.sodienthoai,
                        SUM(phieudieutri.thanhtien) AS total_thanhtien,
                        COUNT(phieudieutri.id) AS soluong
                    FROM
                        khachhang
                    JOIN
                        phieudieutri ON khachhang.id = phieudieutri.khachhang_id
                    WHERE
                        phieudieutri.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                        AND phieudieutri.trangthai = 1
                        AND khachhang.trangthai = 1
                        ${str}
                    GROUP BY
                        khachhang.id, khachhang.ten, khachhang.sodienthoai
                ) AS subquery;
                `, 
                { type: QueryTypes.SELECT }
            );

            return {data, total};
        } catch (error) {
            return error;
        }
    },

    danhSachThongKeKhachHangBanLe: async (startDate, endDate, pageSize, pageNum, customerID) => {
        try {
            let str = '';
            if (customerID) {
                str = `AND khachhang.id = ${customerID}`;
            }
            const data = await banle.sequelize.query(
            `
            SELECT
                khachhang.id,
                khachhang.ten,
                khachhang.sodienthoai,
                SUM(banle.tongdonhang - banle.discountAmount) AS total_banle,
                COUNT(banle.id) as soluong
            FROM
                khachhang
            JOIN
                banle ON khachhang.id = banle.khachhang_id
            WHERE
                banle.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                AND banle.trangthai = 1
                AND khachhang.trangthai = 1
                ${str}
            GROUP BY
                khachhang.id, khachhang.ten, khachhang.sodienthoai
            ORDER BY
                total_banle DESC
            LIMIT ${pageSize} OFFSET ${pageSize * (pageNum - 1)};
            `,
                { type: QueryTypes.SELECT },
            );

            const total = await banle.sequelize.query(
                `
                SELECT COUNT(*) AS totalResults
                FROM (
                    SELECT
                        khachhang.id,
                        khachhang.ten,
                        khachhang.sodienthoai,
                        SUM(banle.tongdonhang - banle.discountAmount) AS total_banle,
                        COUNT(banle.id) AS soluong
                    FROM
                        khachhang
                    JOIN
                        banle ON khachhang.id = banle.khachhang_id
                    WHERE
                        banle.ngaytao BETWEEN '${startDate}' AND '${endDate}' 
                        AND banle.trangthai = 1
                        AND khachhang.trangthai = 1
                        ${str}
                    GROUP BY
                        khachhang.id, khachhang.ten, khachhang.sodienthoai
                ) AS subquery;
                `, 
                { type: QueryTypes.SELECT }
            );

            return {data, total};
        } catch (error) {
            return error;
        }
    },

    thongkeSanPhamBanLe: async (startDate, endDate, nhomSanPhamId, sanPhamId) => {
        try {
            let query = `
            SELECT
                SUM(bl.soluong) AS tong_soluong,
                SUM(bl.dongiaban) AS tong_tien
            FROM
                banle_sanpham bl
            INNER JOIN
                banle ON bl.banle_id = banle.id
            WHERE
                banle.trangthai = 1 AND
                bl.ngaytao BETWEEN '${startDate}' AND '${endDate}';`;

            if (nhomSanPhamId) {
                nhomSanPhamId = parseInt(nhomSanPhamId);
                query = `
                SELECT
                    sp.nhomsanpham_id,
                    SUM(bl.soluong) AS tong_soluong,
                    SUM(bl.dongiaban) AS tong_tien
                FROM
                    banle_sanpham bl
                INNER JOIN
                    sanpham sp ON bl.sanpham_id = sp.id
                INNER JOIN
                    banle ON bl.banle_id = banle.id
                WHERE
                    banle.trangthai = 1 AND
                    sp.nhomsanpham_id = ${nhomSanPhamId} 
                    AND bl.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    sp.nhomsanpham_id;`
            }

            if (sanPhamId) {
                sanPhamId = parseInt(sanPhamId);
                query = `
                SELECT
                    sp.id AS sanpham_id,
                    SUM(bl.soluong) AS tong_soluong,
                    SUM(bl.dongiaban) AS tong_tien
                FROM
                    banle_sanpham bl
                INNER JOIN
                    sanpham sp ON bl.sanpham_id = sp.id
                INNER JOIN
                    banle ON bl.banle_id = banle.id
                WHERE
                    banle.trangthai = 1 AND
                    sp.id = ${sanPhamId}
                    AND bl.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    sp.id;`
            }

            return await banle.sequelize.query(
                query
            ,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    thongkeSanPhamPhieuDieuTri: async (startDate, endDate, nhomSanPhamId, sanPhamId) => {
        try {
            let query = `
            SELECT
                COUNT(ps.sanpham_id) AS tong_soluong,
                SUM(ps.gia) AS tong_tien
            FROM
                phieudieutri_sanpham ps
            INNER JOIN
                phieudieutri pdt ON ps.phieudieutri_id = pdt.id
            WHERE
                pdt.trangthai = 1 AND
                ps.ngaytao BETWEEN '${startDate}' AND '${endDate}';
            `;

            if (nhomSanPhamId) {
                nhomSanPhamId = parseInt(nhomSanPhamId);
                query = `
                SELECT
                    sp.nhomsanpham_id,
                    COUNT(ps.sanpham_id) AS tong_soluong,
                    SUM(ps.gia) AS tong_tien
                FROM
                    phieudieutri_sanpham ps
                INNER JOIN
                    sanpham sp ON ps.sanpham_id = sp.id
                INNER JOIN
                    phieudieutri pdt ON ps.phieudieutri_id = pdt.id
                WHERE
                    sp.nhomsanpham_id = ${nhomSanPhamId}
                    AND pdt.trangthai = 1
                    AND ps.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    sp.nhomsanpham_id;`
            }

            if (sanPhamId) {
                sanPhamId = parseInt(sanPhamId);
                query = `
                SELECT
                    sp.id AS sanpham_id,
                    COUNT(ps.sanpham_id) AS tong_soluong,
                    SUM(ps.gia) AS tong_tien
                FROM
                    phieudieutri_sanpham ps
                INNER JOIN
                    sanpham sp ON ps.sanpham_id = sp.id
                INNER JOIN
                    phieudieutri pdt ON ps.phieudieutri_id = pdt.id
                WHERE
                    sp.id = ${sanPhamId}
                    AND pdt.trangthai = 1
                    AND ps.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    sp.id;`
            }

            return await banle.sequelize.query(
                query
            ,
                { type: QueryTypes.SELECT },
            );
        } catch (error) {
            return error;
        }
    },

    chartSanPhamDieuTri: async (startDate, endDate, pageSize, pageNum) => {
        try {
            const data = await phieudieutri.sequelize.query(
            `
                SELECT
                    sp.id, sp.ten, sp.tenthaythe,
                    COUNT(ps.sanpham_id) AS tong_soluong,
                    SUM(ps.gia) AS tong_tien
                FROM
                    phieudieutri_sanpham ps
                INNER JOIN
                    sanpham sp ON ps.sanpham_id = sp.id
                WHERE
                    sp.trangthai = 1
                    AND sp.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    sp.id
                ORDER BY
                    tong_soluong DESC
                LIMIT ${pageSize} OFFSET ${pageSize * (pageNum - 1)};
            `,
                { type: QueryTypes.SELECT },
            );

            const total = await phieudieutri.sequelize.query(
                `
                SELECT COUNT(*) AS totalResults
                FROM (
                    SELECT
                        sp.id, sp.ten, sp.tenthaythe,
                        COUNT(ps.sanpham_id) AS tong_soluong,
                        SUM(ps.gia) AS tong_tien
                    FROM
                        phieudieutri_sanpham ps
                    INNER JOIN
                        sanpham sp ON ps.sanpham_id = sp.id
                    WHERE
                        sp.trangthai = 1
                        AND sp.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                    GROUP BY
                        sp.id
                ) AS subquery;
                `, 
                { type: QueryTypes.SELECT }
            );
            return {data, total};
        } catch (error) {
            return error;
        }
    },

    chartSanPhamBanLe: async (startDate, endDate, pageSize, pageNum) => {
        try {
            const data = await banle.sequelize.query(
            `
                SELECT
                    sp.id, sp.ten, sp.tenthaythe,
                    SUM(bl.soluong) AS tong_soluong,
                    SUM(bl.dongiaban - bl.productPrice) AS tong_tien
                FROM
                    banle_sanpham bl
                INNER JOIN
                    sanpham sp ON bl.sanpham_id = sp.id
                WHERE
                    sp.trangthai = 1
                    AND sp.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    sp.id
                ORDER BY
                    tong_tien DESC,
                    tong_soluong DESC
                LIMIT ${pageSize} OFFSET ${pageSize * (pageNum - 1)};
            `,

                { type: QueryTypes.SELECT },
            );

            const total = await phieudieutri.sequelize.query(
                `
                SELECT COUNT(*) AS totalResults
                    FROM (
                        SELECT
                        sp.id, sp.ten, sp.tenthaythe,
                        SUM(bl.soluong) AS tong_soluong,
                        SUM(bl.dongiaban - bl.productPrice) AS tong_tien
                    FROM
                        banle_sanpham bl
                    INNER JOIN
                        sanpham sp ON bl.sanpham_id = sp.id
                    WHERE
                        sp.trangthai = 1
                        AND sp.ngaytao BETWEEN '${startDate}' AND '${endDate}'
                    GROUP BY
                        sp.id
                ) AS subquery;
                `, 
                { type: QueryTypes.SELECT }
            );

            return {data, total};
        } catch (error) {
            return error;
        }
    },
};
