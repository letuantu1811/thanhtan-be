const nhomsanpham = require('../../database/models/nhomsanpham');
const { ENUM } = require('../../utils/index');
const sanpham = require('../../database/models/sanpham');
const { localDate } = require('../../utils/localDate');

module.exports = {
    create: async (res) => {
        try {
            return await nhomsanpham.create({
                ngaytao: localDate(new Date()),
                ten: res.ten,
                nguoitao_id: 1,
                trangthai: 1,
            });
        } catch (error) {
            return error;
        }
    },

    update: async (res) => {
        try {
            return await nhomsanpham.update(
                {
                    ten: res.ten,
                    trangthai: 1,
                    nguoitao_id: 1,
                },
                {
                    where: {
                        id: res.id,
                    },
                },
            );
        } catch (error) {
            throw new Error();
        }
    },

    getOne: async (id) => {
        try {
            return await sanpham.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            return error;
        }
    },

    getMany: async (id) => {
        try {
            return await nhomsanpham.findAll({
                include: [
                    {
                        model: sanpham,
                        trangthai: 1,
                    },
                ],
                where: {
                    id: id,
                    trangthai: ENUM.ENABLE,
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            return error;
        }
    },

    // disable sanpham
    disable: async (id) => {   
        try {
            let trangthai = await nhomsanpham.findOne({ where: { id: id } });
            if (trangthai.trangthai) {
                trangthai = 0;
            } else {
                trangthai = 1;
            }
            const result = await nhomsanpham.update({
                trangthai: trangthai
            }, {
                where: {
                    id: id
                },
            });
    
           return result;
        } catch (err) {
            return err;

        }
    },

    deleteCategory: async (id) => {
        try {
            return await nhomsanpham.update(
                {
                    trangthai_xoa: 1,
                    trangthai: ENUM.DISABLE
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
            return await nhomsanpham.findAll({
                where: {
                    trangthai_xoa: ENUM.DISABLE,
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            return error;
        }
    },
};
