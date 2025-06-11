const model = require('../../database/models/phieudieutri');
const { ENUM } = require('../../utils/index');
const dtServices = require('../services/dieutri.services');
const { tzSaiGon } = require('../../utils/saigontz');
const moment = require('moment');
const sequelize = require('sequelize');
const Thanhvien = require('../../database/models/thanhvien');
const { localDate } = require('../../utils/localDate');
const giasuc = require('../../database/models/giasuc');
const phieudieutri = require('../../database/models/phieudieutri');
const phieudieutri_congdichvu = require('../../database/models/phieudieutri_congdichvu');
const khachhang = require('../../database/models/khachhang');
const Congdichvu = require('../../database/models/congdichvu');
const sanpham = require('../../database/models/sanpham');
const { Op, where } = require('sequelize');
const Giong = require('../../database/models/giong');
const Chungloai = require('../../database/models/chungloai');
const { toNumber, isNil, omit } = require('lodash');

module.exports = {
    create: async (res) => {
        console.log(model);
        try {
            return await model.create({
                ngaytao: localDate(new Date()),
                khachhang_id: res.guest_id,
                nguoitao_id: res.user_id,
                trieuchung: res.description,
                ghichu: res.note,
                ngaytaikham: res.re_examination,
                dataikham: res.status_examination,
                congdichvu: res.service_plus,
                thanhtien: res.total,
                discountAmount: toNumber(res.discountAmount) || 0,
                addedDiscountAmount: toNumber(res.addedDiscountAmount) || 0,
            });
        } catch (error) {
            return error;
        }
    },

    createHoSo: async (res, userId) => {
        try {
            if (res.id !== '') {
                await updateTK(res.id);
            }
            let status = '';
            if (res.khachhang.id !== 0 && res.thucung.id !== 0) {
                // tồn tại khách hàng và tồn tại pet
                status = 'existed';
            }
            if (res.khachhang.id !== 0 && res.thucung.id === 0) {
                // tồng tại khách hàng mà không tồn tại pet
                status = 'already';
            }
            if (res.khachhang.id === 0 && res.thucung.id === 0) {
                // khách hàng mới
                status = 'new';
            }
            switch (status) {
                case 'existed':
                    await dtServices.existed(res, userId);
                    break;
                case 'already':
                    await dtServices.already(res, userId);
                    break;
                case 'new':
                    await dtServices.new(res, userId);
                    break;
                default:
                    break;
            }
        } catch (error) {
            throw error;
        }
    },

    // get one model
    getOne: async (id) => {
        try {
            const rawExamForm = await model.findOne({
                include: [
                    {
                        model: giasuc,
                        as: 'giasuc',
                        include: [
                            { model: Giong, as: 'giong' },
                            { model: Chungloai, as: 'chungloai' },
                        ],
                    },
                    { model: khachhang, as: 'khachhang' },
                ],
                where: { id },
            });

            const examForm = rawExamForm.toJSON();

            const discountAmount = toNumber(examForm.discountAmount) || 0;
            const addedDiscountAmount = toNumber(examForm.addedDiscountAmount) || 0;
            const thanhtien = toNumber(examForm.thanhtien) || 0;

            const orginTotalAmount = (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);

            const reCalculateAmountExamForm = { ...examForm, thanhtien: orginTotalAmount };
            return reCalculateAmountExamForm;
        } catch (error) {
            return error;
        }
    },

    // get many san pham
    getMany: async (body) => {
        const limit = body.limit;
        const offset = body.offset;
        const quyen = body.quyen;
        try {
            return await model.findAll({
                where: {
                    state: quyen == 'admin' ? '' : ENUM.ENABLE,
                },
                order: [['ngaytao', 'DESC']],
                offset: offset,
                limit: limit,
            });
        } catch (error) {
            return error;
        }
    },

    // disable model
    disable: async (id) => {
        try {
            return await model.update(
                {
                    state: ENUM.DISABLE,
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

    // disable model
    getAllToday: async (date, isAdmin) => {
        try {
            const today = date || tzSaiGon();
            const defaultIncludes = [
                { model: giasuc, as: 'giasuc' },
                { model: khachhang, as: 'khachhang' },
            ];
            if (!isAdmin) {
                defaultIncludes.push({
                    model: sanpham,
                    where: { an: 0 },
                });
            }

            const currentDateTreatments = await model.findAll({
                include: [...defaultIncludes],
                where: {
                    where: sequelize.where(
                        sequelize.fn('date', sequelize.col('phieudieutri.ngaytao')),
                        '=',
                        today,
                    ),
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });
            return currentDateTreatments.map((treetMent) => {
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
        } catch (error) {
            return error;
        }
    },

   getAllToday_v2: async (pageSize, pageNum, date, paramsCustomer, petName, isAdmin) => {
    const limit = pageSize;
    const offset = (pageNum - 1) * limit;
    const customer = paramsCustomer || '';
    const pet = petName || '';
    let option = {};
    try {
        const today = date || tzSaiGon();
        // Build filter for khachhang
        const khachhangOr = [];
        if (customer) {
            khachhangOr.push({ sodienthoai: { [Op.like]: `%${customer}%` } });
            khachhangOr.push({ ten: { [Op.like]: `%${customer}%` } });
            khachhangOr.push({ diachi: { [Op.like]: `%${customer}%` } });
        }
        const khachhangWhere = khachhangOr.length > 0 ? { [Op.or]: khachhangOr } : undefined;

        // Build filter for giasuc
        const giasucWhere = pet ? { ten: { [Op.like]: `%${pet}%` } } : undefined;

        // Build includes for data query
        const defaultIncludes = [
            ...(giasucWhere ? [{
                model: giasuc,
                as: 'giasuc',
                where: giasucWhere
            }] : [{
                model: giasuc,
                as: 'giasuc'
            }]),
            ...(khachhangWhere ? [{
                model: khachhang,
                as: 'khachhang',
                where: khachhangWhere
            }] : [{
                model: khachhang,
                as: 'khachhang'
            }])
        ];
        if (!isAdmin) {
            defaultIncludes.push({
                model: sanpham,
                where: { an: 0 },
            });
            option.option = 0;
        }

        const whereClause = {
            where: sequelize.where(
                sequelize.fn('date', sequelize.col('phieudieutri.ngaytao')),
                '=',
                today,
            ),
            trangthai: 1,
            ...option
        };

        // Query data
        const currentDateTreatments = await model.findAll({
            include: defaultIncludes,
            where: whereClause,
            order: [['ngaytao', 'DESC']],
            limit,
            offset
        });

        // Tối ưu count
        let total = 0;
        let countWhere = `trangthai = 1 AND DATE(ngaytao) = :today`;
        let replacements = { today };

        if (pet) {
            // Lấy id thú cưng phù hợp
            const gs = await giasuc.findAll({
                attributes: ['id'],
                where: giasucWhere,
                raw: true
            });
            const giasucIds = gs.map(item => item.id);
            if (giasucIds.length === 0) {
                return { data: [], pagination: { totalPages: 0, currentPage: pageNum, pageSize, totalItems: 0 } };
            }
            countWhere += ` AND giasuc_id IN (:giasucIds)`;
            replacements.giasucIds = giasucIds;
        }

        if (khachhangWhere) {
            // Lấy id khách hàng phù hợp
            const khs = await khachhang.findAll({
                attributes: ['id'],
                where: khachhangWhere,
                raw: true
            });
            const khachhangIds = khs.map(item => item.id);
            if (khachhangIds.length === 0) {
                return { data: [], pagination: { totalPages: 0, currentPage: pageNum, pageSize, totalItems: 0 } };
            }
            countWhere += ` AND khachhang_id IN (:khachhangIds)`;
            replacements.khachhangIds = khachhangIds;
        }

        // Raw query count nhanh
        const [result] = await model.sequelize.query(
            `SELECT COUNT(*) as total FROM phieudieutri WHERE ${countWhere}`,
            {
                replacements,
                type: sequelize.QueryTypes.SELECT
            }
        );
        total = result.total || 0;

        const totalPages = Math.ceil(total / pageSize);
        const pagination = {
            totalPages,
            currentPage: pageNum,
            pageSize,
            totalItems: total,
        };

        const data = currentDateTreatments.map(treetMent => recalculateAmount(treetMent.toJSON()));
        return { data, pagination };
    } catch (error) {
        return error;
    }
},

    getAll: async (role) => {
        const obj = {
            limit: null,
        };
        if (role.toUpperCase() === 'USER') {
            const config = await Thanhvien.findOne({
                attributes: ['config'],
                where: { id: 1 },
            });
            obj.limit = config.config;
        }
        try {
            const today = tzSaiGon();
            return await model.findAll({
                include: [
                    {
                        model: giasuc,
                    },
                ],
                ...obj,
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

    getReExamByDate: async (date, isAdmin) => {
        try {
            const selectedDate = date || tzSaiGon();

            const defaultIncludes = [
                { model: giasuc, as: 'giasuc' },
                { model: khachhang, as: 'khachhang' },
            ];
            if (!isAdmin) {
                defaultIncludes.push({
                    model: sanpham,
                    where: { an: 0 },
                });
            }

            const treetments = await model.findAll({
                include: [...defaultIncludes],
                where: {
                    where: sequelize.where(
                        sequelize.fn('date', sequelize.col('ngaytaikham')),
                        '=',
                        selectedDate,
                    ),
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });

            return treetments.map((treetMent) => {
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
        } catch (error) {
            return error;
        }
    },

    getReExamByDate_v2: async (pageSize, pageNum, date, isAdmin, paramsCustomer, petName) => {
        const customer = paramsCustomer || '';
        const pet = petName || '';
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;
        let option = {};
        try {
            const selectedDate = date || tzSaiGon();
            // Build filter for khachhang
            const khachhangOr = [];
            if (customer) {
                khachhangOr.push({ sodienthoai: { [Op.like]: `%${customer}%` } });
                khachhangOr.push({ ten: { [Op.like]: `%${customer}%` } });
                khachhangOr.push({ diachi: { [Op.like]: `%${customer}%` } });
            }
            const khachhangWhere = khachhangOr.length > 0 ? { [Op.or]: khachhangOr } : undefined;

            // Build filter for giasuc
            const giasucWhere = pet ? { ten: { [Op.like]: `%${pet}%` } } : undefined;

            // Build includes for data query
            const defaultIncludes = [
                ...(giasucWhere ? [{
                    model: giasuc,
                    as: 'giasuc',
                    where: giasucWhere
                }] : [{
                    model: giasuc,
                    as: 'giasuc'
                }]),
                ...(khachhangWhere ? [{
                    model: khachhang,
                    as: 'khachhang',
                    where: khachhangWhere
                }] : [{
                    model: khachhang,
                    as: 'khachhang'
                }])
            ];
            if (!isAdmin) {
                defaultIncludes.push({
                    model: sanpham,
                    where: { an: 0 },
                });
                option.option = 0;
            }

            const whereClause = {
                where: sequelize.where(
                    sequelize.fn('date', sequelize.col('ngaytaikham')),
                    '=',
                    selectedDate,
                ),
                trangthai: 1,
                ...option
            };

            // Query data
            const treetments = await model.findAll({
                include: defaultIncludes,
                where: whereClause,
                order: [['ngaytao', 'DESC']],
                limit,
                offset
            });

            // Tối ưu count
            // Lấy danh sách id của giasuc và khachhang nếu có lọc
            let countWhere = { ...whereClause };
            if (giasucWhere) {
                const gs = await giasuc.findAll({
                    attributes: ['id'],
                    where: giasucWhere,
                    raw: true
                });
                const giasucIds = gs.map(item => item.id);
                if (giasucIds.length === 0) {
                    return { data: [], pagination: { totalPages: 0, currentPage: pageNum, pageSize, totalItems: 0 } };
                }
                countWhere.giasuc_id = { [Op.in]: giasucIds };
            }
            if (khachhangWhere) {
                const khs = await khachhang.findAll({
                    attributes: ['id'],
                    where: khachhangWhere,
                    raw: true
                });
                const khachhangIds = khs.map(item => item.id);
                if (khachhangIds.length === 0) {
                    return { data: [], pagination: { totalPages: 0, currentPage: pageNum, pageSize, totalItems: 0 } };
                }
                countWhere.khachhang_id = { [Op.in]: khachhangIds };
            }

            // Count nhanh không include
            const total = await model.count({ where: countWhere });

            const totalPages = Math.ceil(total / pageSize);
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems: total,
            };

            const data = treetments.map(treetMent => recalculateAmount(treetMent.toJSON()));
            return { data, pagination };
        } catch (error) {
            return error;
        }
    },

    getNotification: async (role) => {
        try {
            const today = tzSaiGon();

            // Raw query count cho reExamCount
            const [reExamResult] = await model.sequelize.query(
                `SELECT COUNT(*) as total FROM phieudieutri WHERE DATE(ngaytaikham) = :today`,
                {
                    replacements: { today },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            const reExamCount = reExamResult.total || 0;

            // Raw query count cho examTodayCount
            const [examTodayResult] = await model.sequelize.query(
                `SELECT COUNT(*) as total FROM phieudieutri WHERE DATE(ngaytao) = :today AND trangthai = 1`,
                {
                    replacements: { today },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            const examTodayCount = examTodayResult.total || 0;

            if (role === 'USER') {
                return {
                    countDTtoday: 0,
                    countTDTtody: 0,
                };
            } else {
                return {
                    countDTtoday: examTodayCount,
                    countTDTtody: reExamCount,
                };
            }
        } catch (error) {
            return error;
        }
    },

    importEXAM: async (res) => {
        console.log(model);
        try {
            const arr = [];
            let obj = {
                mapping_id: '',
                khachhang_id: 0,
                nguoitao_id: 0,
                ngaytao: '',
                ngaysua: '',
                trangthai: 1,
                trieuchung: '',
                ghichu: '',
                ngaytaikham: 1,
                dataikham: 0,
                tylegiamgia: 0,
                thanhtien: 0,
                giasuc_id: 1,
                noidung: '',
                bacsi_id: 1,
                chandoan: '',
            };
            for (let index = 0; index < res.length; index++) {
                const item = res[index];
                const kh = await khachhang.findOne({
                    where: {
                        sodienthoai: item.thongtin.DienThoai,
                    },
                });
                let name = {};
                if (kh) {
                    // let name = await giasuc.findOne({ where: { ten: item.thongtin.TenGiaSuc, khachhang_id: kh.dataValues.id } });
                    name = await giasuc.findOne({
                        where: {
                            ten: item.thongtin.TenGiaSuc,
                            khachhang_id: kh.dataValues.id,
                        },
                    });
                } else {
                    name = await giasuc.findOne({
                        where: { ten: item.thongtin.TenGiaSuc },
                    });
                }
                // console.log(name);
                if (name !== null) {
                    obj = new Object();
                    obj.khachhang_id = name.dataValues.id;
                    obj.nguoitao_id = 1;
                    obj.ngaytao = item.NgayPhatSinh;
                    obj.ngaysua = item.NgaySuaDoi;
                    obj.trangthai = item.Xoa ? 0 : 1;
                    obj.trieuchung = item.TrieuChung;
                    obj.chandoan = item.ChanDoan;
                    obj.ghichu = item.GhiChu;
                    obj.ngaytaikham = item.NgayTaiKham;
                    obj.dataikham = item.DaTaiKham;
                    obj.tylegiamgia = item.TyLeGiamGia;
                    obj.mapping_id = item.PhieuDieuTriId;
                    arr.push(obj);
                }
            }
            await phieudieutri.bulkCreate(arr);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    importServicePlus: async (res) => {
        try {
            let obj = {
                phieudieutri_id: 0,
                congdichvu_id: 0,
                gia: 0,
                ngaytao: '',
            };
            const arr = [];
            // ``
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                const pdtID = await phieudieutri.findOne({
                    attributes: ['id'],
                    where: {
                        mapping_id: element.PhieuDieuTriId,
                    },
                });
                for (let index2 = 0; index2 < element.congdichvu.length; index2++) {
                    const cdv = element.congdichvu[index2];
                    const cdvID = await Congdichvu.findOne({
                        attributes: ['id', 'gia'],
                        where: {
                            ten: cdv.TenCongDichVu,
                        },
                    });
                    obj = new Object();
                    if (cdvID !== null && pdtID !== null) {
                        obj.phieudieutri_id = pdtID.id !== null ? pdtID.id : '';
                        obj.congdichvu_id = cdvID.id !== null ? cdvID.id : '';
                        obj.ngaytao = element.NgayDieuTri;
                        obj.gia = cdvID.gia ? cdvID.gia.replace(/,/g, '') : '0';
                        if (obj.phieudieutri_id !== '' || obj.congdichvu_id !== '') arr.push(obj);
                    }
                }
            }
            if (arr.length > 0) {
                return phieudieutri_congdichvu.sequelize.transaction().then(async (t) => {
                    return await phieudieutri_congdichvu
                        .bulkCreate(arr, { transaction: t })
                        .then(() => {
                            return t.commit();
                        })
                        .catch((err) => {
                            console.log(err + ' tại func thêm phieudieutri_congdichv');
                            t.rollback();
                            throw Error(err);
                        });
                });
            }
            // console.log(arr);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    importProducts: async (res) => {
        try {
            let obj = {
                phieudieutri_id: 0,
                sanpham_id: 0,
                gia: 0,
                ngaytao: '',
            };
            const arr = [];
            // ``
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                const pdtID = await phieudieutri.findOne({
                    attributes: ['id'],
                    where: {
                        mapping_id: element.PhieuDieuTriId,
                    },
                });
                for (let index2 = 0; index2 < element.sanpham.length; index2++) {
                    const cdv = element.sanpham[index2];
                    const spID = await sanpham.findOne({
                        attributes: ['id', 'gia'],
                        where: {
                            ten: cdv.TenThuoc,
                        },
                    });
                    obj = new Object();
                    if (spID !== null && pdtID !== null) {
                        obj.phieudieutri_id = pdtID.id !== null ? pdtID.id : '';
                        obj.sanpham_id = spID.id !== null ? spID.id : '';
                        obj.ngaytao = element.NgayPhatSinh;
                        obj.gia = spID.gia;
                        if (obj.phieudieutri_id !== '' || obj.sanpham_id !== '') arr.push(obj);
                    }
                }
            }
            if (arr.length > 0) {
                return phieudieutri_sanpham.sequelize.transaction().then(async (t) => {
                    return await phieudieutri_sanpham
                        .bulkCreate(arr, { transaction: t })
                        .then(() => {
                            return t.commit();
                        })
                        .catch((err) => {
                            console.log(err + ' tại func thêm phieudieutri_sanpham');
                            t.rollback();
                            throw Error(err);
                        });
                });
            }
            // console.log(arr);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    getAllExamByPetId: async (id, isViewedNonRestricted) => {
        try {
            const defaultIncludes = [
                {
                    model: Congdichvu,
                },
                { model: giasuc },
                { model: khachhang, as: 'khachhang' },
            ];
            let option = {};
            if (isViewedNonRestricted) {
                defaultIncludes.push({
                    model: sanpham,
                });
            } else {
                defaultIncludes.push({
                    model: sanpham,
                    where: { an: 0 },
                });
                option.option = 0;
            }

            return await model.findAll({
                include: [...defaultIncludes],
                where: {
                    trangthai: 1,
                    giasuc_id: id,
                    ...option
                },
                order: [['ngaytao', 'DESC']],
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    updateHSBA: async (data) => {
        try {
            await model.update(
                {
                    noidung: JSON.stringify(data),
                    trieuchung: data.trieuchung,
                    chandoan: data.chandoan,
                    ghichu: data.ghichu,
                    ngaytao: data.ngaykham,
                    ngaytaikham: data.ngaytaikham,
                    tiensubenh: data.tiensubenh,
                    khambenh: data.khambenh,
                    payment_id: data.paymentId,
                    typedieutri_id: data.typeDieuTriID
                },
                {
                    where: {
                        id: data.id,
                    },
                },
            );
        } catch (error) {
            throw new Error();
        }
    },

    updatePet: async (data) => {
        try {
            let temp = {};
            if (data.ngaytao || data.ngaysua) {
                temp.ngaytao = data.ngaytao
                temp.ngaysua = data.ngaysua
            }
            const params = {
                ten: data.ten,
                tuoi: data.tuoi,
                trangthai_song: data.trangthai_song,
                ...temp
            }
            await giasuc.update( params ,
                {
                    where: {
                        id: data.id,
                    },
                },
            );
        } catch (error) {
            throw new Error();
        }
    },

    deletePet: async (id) => {
        try {
            await giasuc.update(
                {
                    trangthai: 0,
                },
                {
                    where: {
                        id: id,
                    },
                },
            );
        } catch (error) {
            throw new Error();
        }
    },

    deleteDT: async (id) => {
        try {
            await phieudieutri.update(
                {
                    trangthai: 0,
                },
                {
                    where: {
                        id: id,
                    },
                },
            );
        } catch (error) {
            throw new Error();
        }
    },

    deleteDTMulti: async (data) => {
        const t = await phieudieutri.sequelize.transaction();
        try {
          for (const id of data) {
            await phieudieutri.update(
                {
                    trangthai: 0,
                },
                {
                    where: {
                        id: id,
                    },
                },
                { transaction: t },
            )
          }
          await t.commit();
        } catch (error) {
          await t.rollback();
          throw new Error(err);
        }
    },

    getPetExamination: async () => {
        try {
            const data = await giasuc.findAll({
                include: [
                    {
                        model: khachhang,
                        as: 'khachhang',
                        attributes: ['ten', 'sodienthoai', 'diachi'],
                    },
                    {
                        model: phieudieutri,
                        attributes: ['sophieudieutri'],
                    },
                    {
                        model: Giong,
                        as: 'giong',
                        include: {
                            model: Chungloai,
                            as: 'chungloai',
                            attributes: ['id', 'ten', 'nguoitao_id'],
                        },
                        attributes: ['id', 'nguoitao_id', 'ngaytao', 'taikham', 'chungloai_id'],
                    },
                ],
                where: {
                    trangthai: 1,
                },
                order: [['ngaytao', 'DESC']],
            });
            return data.map((item) => item.toJSON());
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    // Paging Pet Examination
    getPetExaminationPaging: async (pageSize, pageNum, phone, name, address, petName, isAdmin) => {
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;

        const phoneParam = phone || '';
        const nameParam = name || '';
        const addressParam = address || '';
        const pet = petName || '';
        let option = {};
        if (!isAdmin) option.option = 0;

        // Build dynamic customer filter
        const khachhangOr = [];
        if (phoneParam) khachhangOr.push({ sodienthoai: { [Op.like]: `%${phoneParam}%` } });
        if (nameParam) khachhangOr.push({ ten: { [Op.like]: `%${nameParam}%` } });
        if (addressParam) khachhangOr.push({ diachi: { [Op.like]: `%${addressParam}%` } });
        const hasCustomerFilter = khachhangOr.length > 0;
        const khachhangWhere = hasCustomerFilter ? { [Op.or]: khachhangOr } : undefined;

        const giasucWhere = {
            trangthai: 1,
            ten: { [Op.like]: `%${pet}%` }
        };

        // Build includes for data query
        const includes = [
            hasCustomerFilter
                ? {
                    model: khachhang,
                    as: 'khachhang',
                    where: khachhangWhere,
                }
                : {
                    model: khachhang,
                    as: 'khachhang',
                },
            {
                model: phieudieutri,
                where: { trangthai: 1, ...option }
            },
            {
                model: Giong,
                as: 'giong',
                include: { model: Chungloai, as: 'chungloai' },
            },
        ];

        try {
            // 1. Query paged data
            const data = await giasuc.findAll({
                include: includes,
                where: giasucWhere,
                order: [['ngaytao', 'DESC']],
                limit,
                offset
            });

            // 2. Fast count: only filter by khachhang_id if needed
            let countWhere = { ...giasucWhere };
            if (hasCustomerFilter) {
                const khIds = await khachhang.findAll({
                    attributes: ['id'],
                    where: khachhangWhere,
                    raw: true
                });
                const khachhangIds = khIds.map(kh => kh.id);
                if (khachhangIds.length === 0) {
                    return { data: [], pagination: { totalPages: 0, currentPage: pageNum, pageSize, totalItems: 0 } };
                }
                countWhere.khachhang_id = { [Op.in]: khachhangIds };
            }

            // 3. Fast count (no includes)
            const total = await giasuc.count({ where: countWhere });

            const totalPages = Math.ceil(total / pageSize);
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems: total,
            };
            return { data, pagination };
        } catch (error) {
            console.log(error);
            return {
                data: [],
                pagination: { totalPages: 0, currentPage: pageNum, pageSize, totalItems: 0 },
                error: true,
                message: error.message || 'Internal server error'
            };
        }
    },



    // get medical history
    getPetMedicalHistory: async (id) => {
        try {
            return await model.findAll({
                attributes: ['trieuchung', 'chandoan', 'ghichu'],
                include: {
                    attributes: ['id'],
                    required: true,
                    model: giasuc,
                    where: {
                        id: id,
                    },
                },
            });
        } catch (error) {
            return error;
        }
    },

    // get medical history v2 pagination
    getPetMedicalHistory_v2: async (id) => {
        try {
            return await model.findAll({
                attributes: ['tiensubenh', 'trieuchung', 'chandoan', 'ghichu', 'ngaytao'],
                include: {
                    attributes: ['id'],
                    required: true,
                    model: giasuc,
                    where: {
                        id: id,
                    },
                },
                order: [['ngaytao', 'DESC']]
            });
        } catch (error) {
            return error;
        }
    },

    isExisted: async (id) => {
        try {
            const today = tzSaiGon();
            return await model.count({
                where: {
                    giasuc_id: id,
                    where: sequelize.where(
                        sequelize.fn('date', sequelize.col('ngaytao')),
                        '=',
                        today,
                    ),
                },
            });
        } catch (error) {
            return error;
        }
    },

    filterBlockedInExam: async (pddID) => {
        try {
            const kh = await phieudieutri.count({
                include: {
                    model: sanpham,
                    where: {
                        an: 1,
                    },
                    attributes: ['id'],
                },
                where: {
                    id: pddID,
                },
            });
            return kh;
        } catch (error) {
            console.log(error);
        }
    },
};

function updateTK(id) {
    try {
        return model.update(
            {
                dataikham: 1,
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
}

function recalculateAmount(rawTreetMent) {
    const discountAmount = toNumber(rawTreetMent.discountAmount) || 0;
    const addedDiscountAmount = toNumber(rawTreetMent.addedDiscountAmount) || 0;
    const thanhtien = toNumber(rawTreetMent.thanhtien) || 0;
    const orginTotalAmount = (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);

    return {
        ...rawTreetMent,
        discountAmount: 0,
        addedDiscountAmount: 0,
        thanhtien: orginTotalAmount,
    };
}