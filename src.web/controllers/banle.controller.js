const model = require('../../database/models/banle');
const { ENUM } = require('../../utils/index');
const sanpham = require('../../database/models/sanpham');
const Donvitinh = require('../../database/models/donvitinh');
const BL_SP = require('../../database/models/banle_sanpham');
const khachhang = require('../../database/models/khachhang');
const Thanhvien = require('../../database/models/thanhvien');
const { localDate } = require('../../utils/localDate');
const OrderService = require('../services/OrderService');
const { PRINT_MODE } = require('../../utils/enum');
const { BadRequestException } = require('../../utils/api.res/api.error');

module.exports = {
    getOne: async (id) => {
        try {
            return await model.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            return error;
        }
    },

    getMany: async (body) => {
        try {
            return await model.findAll({
                where: {
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            return error;
        }
    },

    disable: async (id) => {
        try {
            return await model.update(
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

    getAll: async () => {
        try {
            return await model.findAll({
                include: [
                    {
                        model: sanpham,
                        as: 'sanpham',
                        include: {
                            model: Donvitinh,
                            as: 'donvitinh',
                        },
                    },
                    {
                        model: khachhang,
                        as: 'khachhang',
                    },
                    {
                        attributes: { exclude: ['matkhau'] },
                        model: Thanhvien,
                        as: 'nguoiban',
                    },
                ],
                order: [['ngaytao', 'DESC']],
                where: {
                    trangthai: ENUM.ENABLE,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    createOrders: async (body) => {
        try {
            const date = localDate(new Date());
            const banleID = await model
                .create({
                    ngaytao: date,
                    ten: body.ten,
                    ghichu: body.ghichu,
                    nguoitao_id: body.nguoitao_id,
                    trangthai: 1,
                    tylegiamgia: body.tylegiamgia,
                    tongdonhang: body.tongdonhang,
                })
                .then(async (res) => {
                    return res.dataValues.id;
                });
            console.log(banleID);
            const arr = [];
            if (body.listSP.length < 1) {
                throw new Error();
            }
            for (let index = 0; index < body.listSP.length; index++) {
                const element = body.listSP[index];
                let obj = {
                    banle_id: 0,
                    sanpham_id: 0,
                    soluong: 0,
                    dongiaban: 0,
                };
                obj = new Object();
                obj.banle_id = banleID;
                obj.sanpham_id = element.id;
                obj.soluong = element.soluong;
                obj.dongiaban = element.dongiaban;
                const soluongconlai =
                    Number.parseInt(element.soluongcon) - Number.parseInt(element.soluong);
                await sanpham.update(
                    { soluong: soluongconlai < 0 ? 0 : soluongconlai },
                    {
                        where: {
                            id: element.id,
                        },
                    },
                );
                arr.push(obj);
            }
            await BL_SP.bulkCreate(arr).then((res) => {
                return res;
            });
        } catch (error) {
            return error;
        }
    },

    printBill: async (userId, mode, payload) => {
        if (![PRINT_MODE.A5, PRINT_MODE.K80].includes(mode)) {
            throw new BadRequestException(
                `Định dạng ${mode} không được hỗ trợ. Vui lòng chọn khổ K80 hoặc A5.`,
            );
        }
        return await OrderService.getInvoiceTemplate(userId, mode, payload);
    },
};
