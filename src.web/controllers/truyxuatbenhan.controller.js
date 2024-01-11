const nhomsanpham = require('../../database/models/nhomsanpham');
const phieudieutri = require('../../database/models/phieudieutri');
const sanpham = require('../../database/models/sanpham');
const giasuc = require('../../database/models/giasuc');
const khachhang = require('../../database/models/khachhang');
const { ENUM } = require('../../utils/index');
const { Op } = require('sequelize');
const { localDate } = require('../../utils/localDate');
const moment = require('moment');

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

    getExaminationWithRabisin_v2: async (pageSize, pageNum, fromDate, toDate, paramsCustomer, petName) => {
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;

        let from_date = moment().startOf('day').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
        let to_date = moment().format('YYYY-MM-DD HH:mm:ss');
        if (fromDate && toDate) {
            from_date = moment(parseInt(fromDate)).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            to_date = moment(parseInt(toDate)).format('YYYY-MM-DD HH:mm:ss');
        }
        const customer = paramsCustomer ? paramsCustomer : '';
        const pet = petName ? petName : '';

        const defaultIncludes = [
            { model: giasuc,
                as: 'giasuc',
                where: {
                    ten: { [Op.like]: `%${pet}%` },
                }
            },
            { 
                attributes: [],
                model: khachhang, 
                as: 'khachhang',
                where: {
                    [Op.or]: [
                        {
                            sodienthoai: { [Op.like]: `%${customer}%` }
                        },
                        {
                            ten: { [Op.like]: `%${customer}%` }
                        },
                        {
                            diachi: { [Op.like]: `%${customer}%` }
                        }
                    ],
                }                
            },
            {
                model: sanpham,
                where: {
                    id: 261,
                },
                require: true,
            },
        ];

        try {
            const data = await phieudieutri.findAll({
                include: [...defaultIncludes],
                where: {
                    trangthai: 1,
                    ngaytao: {
                        [Op.gte]: from_date,
                        [Op.lte]: to_date,
                    },
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
                        [Op.gte]: from_date,
                        [Op.lte]: to_date,
                    },
                },
            });

            const totalItems = total; 
            const totalPages = Math.ceil(totalItems / pageSize);
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            }; 
            return { data, pagination };
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

    getExaminationWithMedicinName_v2: async (id, pageSize, pageNum, fromDate, toDate, isAdmin) => {
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;
        let from_date = moment().startOf('day').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
        let to_date = moment().format('YYYY-MM-DD HH:mm:ss');
        if (fromDate && toDate) {
            from_date = moment(parseInt(fromDate)).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            to_date = moment(parseInt(toDate)).format('YYYY-MM-DD HH:mm:ss');
        }
        let object = {};
        if (id !== 'null') {
            object = {
                where: {
                    id: id,
                },
            };
        }
        let option = {};
        if (!isAdmin) {
            option.option = 0;
        }
        try {
            const data = await phieudieutri.findAll({
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
                    ngaytao: {
                        [Op.gte]: from_date,
                        [Op.lte]: to_date,
                    },
                    ...option
                },
                order: [['ngaytao', 'DESC']],
                limit,
                offset
            });
            const total = await phieudieutri.count({
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
                    ngaytao: {
                        [Op.gte]: from_date,
                        [Op.lte]: to_date,
                    },
                    ...option
                },
            });

            const totalItems = total; 
            const totalPages = Math.ceil(totalItems / pageSize);
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            }; 
            return { data, pagination };           
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
};
