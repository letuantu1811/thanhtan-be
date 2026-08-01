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
        const limit = Math.min(parseInt(pageSize) || 10, 150);
        const offset = (parseInt(pageNum) - 1) * limit;
        const customer = paramsCustomer || '';
        const pet = petName || '';

        try {
            const today = date || tzSaiGon(); // Giả định trả về chuỗi dạng 'YYYY-MM-DD'
            
            // TỐI ƯU KHÔNG GÂY PHÁ INDEX: Tạo mốc thời gian trong ngày
            const startOfDay = `${today} 00:00:00`;
            const endOfDay = `${today} 23:59:59`;

            const khachhangOr = [];
            if (customer) {
                khachhangOr.push({ sodienthoai: { [Op.like]: `%${customer}%` } });
                khachhangOr.push({ ten: { [Op.like]: `%${customer}%` } });
                khachhangOr.push({ diachi: { [Op.like]: `%${customer}%` } });
            }
            const khachhangWhere = khachhangOr.length > 0 ? { [Op.or]: khachhangOr } : undefined;
            const giasucWhere = pet ? { ten: { [Op.like]: `%${pet}%` } } : undefined;

            const dataIncludes = [
                { model: giasuc, as: 'giasuc', ...(giasucWhere && { where: giasucWhere, required: true }) },
                { model: khachhang, as: 'khachhang', ...(khachhangWhere && { where: khachhangWhere, required: true }) },
                { model: Thanhvien, as: 'nguoitao', attributes: ['id', 'tendaydu'] }
            ];

            const countIncludes = [];
            if (giasucWhere) countIncludes.push({ model: giasuc, as: 'giasuc', where: giasucWhere, attributes: [], required: true });
            if (khachhangWhere) countIncludes.push({ model: khachhang, as: 'khachhang', where: khachhangWhere, attributes: [], required: true });

            const extraWhere = {};
            if (!isAdmin) {
                dataIncludes.push({ model: sanpham, where: { an: 0 }, required: true });
                countIncludes.push({ model: sanpham, where: { an: 0 }, attributes: [], required: true });
                extraWhere.option = 0;
            }

            // CẤU TRÚC WHERE MỚI: Tận dụng hoàn toàn Index của MySQL
            const pureWhereClause = {
                [Op.and]: [
                    {
                        ngaytao: {
                            [Op.between]: [startOfDay, endOfDay]
                        }
                    },
                    { trangthai: 1 },
                    extraWhere
                ]
            };

            const [currentDateTreatments, total] = await Promise.all([
                model.findAll({ include: dataIncludes, where: pureWhereClause, order: [['ngaytao', 'DESC']], limit, offset, subQuery: false }),
                model.count({ include: countIncludes, where: pureWhereClause, distinct: true, col: 'id', subQuery: false })
            ]);

            const totalPages = Math.ceil(total / limit);
            return {
                data: currentDateTreatments.map(treetMent => {
                    const raw = treetMent.toJSON();
                    const processed = recalculateAmount(raw);
                    return {
                        ...processed,
                        nguoitao_fullname: raw.nguoitao ? raw.nguoitao.tendaydu : null,
                        nguoitao_id: raw.nguoitao_id || (raw.nguoitao ? raw.nguoitao.id : null),
                    };
                }),
                pagination: { totalPages, currentPage: parseInt(pageNum), pageSize: limit, totalItems: total }
            };
        } catch (error) {
            console.error('Lỗi tại getAllToday_v2:', error);
            throw error;
        }
    },


    getAll: async (role) => {
        const obj = {
            limit: null,
        };
        if (role?.toUpperCase() === 'USER') {
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
        
        const extraWhere = {};
        if (!isAdmin) {
            defaultIncludes.push({
                model: sanpham,
                where: { an: 0 },
                required: true // Ép inner join để lọc chính xác dữ liệu hiển thị của user thường
            });
            extraWhere.option = 0;
        }

        // SỬA LỖI: Gom cụm điều kiện Where chuẩn hóa, sửa lỗi lồng 'where: { where: ... }'
        const pureWhereClause = {
            [Op.and]: [
                sequelize.where(
                    sequelize.fn('date', sequelize.col('ngaytaikham')),
                    '=',
                    selectedDate
                ),
                { trangthai: 1 },
                extraWhere
            ]
        };

        const treetments = await model.findAll({
            include: defaultIncludes,
            where: pureWhereClause,
            order: [['ngaytao', 'DESC']],
            subQuery: false // Tắt subQuery để câu lệnh JOIN chạy mượt và nhanh hơn
        });

        // Giữ nguyên logic tính toán tiền của bạn nhưng bọc trong code sạch hơn
        return treetments.map((treetMent) => {
            const rawTreetMent = treetMent.toJSON();
            const discountAmount = toNumber(rawTreetMent.discountAmount) || 0;
            const addedDiscountAmount = toNumber(rawTreetMent.addedDiscountAmount) || 0;
            const thanhtien = toNumber(rawTreetMent.thanhtien) || 0;

            const orginTotalAmount =
                (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);

            return {
                ...rawTreetMent,
                discountAmount: 0,
                addedDiscountAmount: 0,
                thanhtien: orginTotalAmount,
            };
        });
    } catch (error) {
        console.error('Lỗi tại getReExamByDate:', error);
        throw error; // Ném lỗi ra ngoài để Controller bắt và phản hồi HTTP 500 thay vì nuốt lỗi
    }
},

    getReExamByDate_v2: async (pageSize, pageNum, date, isAdmin, paramsCustomer, petName) => {
        // Ép sàn tối đa để bảo vệ hệ thống khỏi tràn bộ nhớ khi FE truyền số quá lớn
        const limit = Math.min(parseInt(pageSize) || 10, 150); 
        const offset = (parseInt(pageNum) - 1) * limit;
        const customer = paramsCustomer || '';
        const pet = petName || '';

        try {
            const selectedDate = date || tzSaiGon(); // Giả định chuỗi ngày có dạng 'YYYY-MM-DD'

            // TỐI ƯU KHÔNG GÂY PHÁ INDEX: Tạo mốc thời gian bắt đầu và kết thúc trong ngày
            const startOfReExam = `${selectedDate} 00:00:00`;
            const endOfReExam = `${selectedDate} 23:59:59`;

            // 1. Xây dựng bộ lọc cho Khách hàng
            const khachhangOr = [];
            if (customer) {
                khachhangOr.push({ sodienthoai: { [Op.like]: `%${customer}%` } });
                khachhangOr.push({ ten: { [Op.like]: `%${customer}%` } });
                khachhangOr.push({ diachi: { [Op.like]: `%${customer}%` } });
            }
            const khachhangWhere = khachhangOr.length > 0 ? { [Op.or]: khachhangOr } : undefined;

            // 2. Xây dựng bộ lọc cho Gia súc (Pet)
            const giasucWhere = pet ? { ten: { [Op.like]: `%${pet}%` } } : undefined;

            // 3. MẢNG INCLUDE ĐẦY ĐỦ ĐỂ LẤY DỮ LIỆU hiển thị (findAll)
            const dataIncludes = [
                {
                    model: giasuc,
                    as: 'giasuc',
                    ...(giasucWhere && { where: giasucWhere, required: true })
                },
                {
                    model: khachhang,
                    as: 'khachhang',
                    ...(khachhangWhere && { where: khachhangWhere, required: true })
                }
            ];

            // 4. MẢNG INCLUDE SIÊU RÚT GỌN ĐỂ ĐẾM (count) - Loại bỏ cột thừa chống ETIMEDOUT
            const countIncludes = [];
            if (giasucWhere) {
                countIncludes.push({
                    model: giasuc,
                    as: 'giasuc',
                    where: giasucWhere,
                    attributes: [], 
                    required: true
                });
            }
            if (khachhangWhere) {
                countIncludes.push({
                    model: khachhang,
                    as: 'khachhang',
                    where: khachhangWhere,
                    attributes: [], 
                    required: true
                });
            }

            // Thêm điều kiện ẩn sản phẩm nếu không phải Admin
            const extraWhere = {};
            if (!isAdmin) {
                const sanphamInclude = {
                    model: sanpham,
                    where: { an: 0 },
                    attributes: [], 
                    required: true 
                };
                dataIncludes.push({ ...sanphamInclude, attributes: undefined }); 
                countIncludes.push(sanphamInclude); 
                extraWhere.option = 0; 
            }

            // 5. CẤU TRÚC WHERE MỚI: Tận dụng hoàn toàn chỉ mục Index của MySQL
            const pureWhereClause = {
                [Op.and]: [
                    {
                        ngaytaikham: {
                            [Op.between]: [startOfReExam, endOfReExam]
                        }
                    },
                    { trangthai: 1 },
                    extraWhere
                ]
            };

            // 6. Thực thi truy vấn song song an toàn tuyệt đối
            const [treetments, total] = await Promise.all([
                model.findAll({
                    include: dataIncludes,
                    where: pureWhereClause,
                    order: [['ngaytao', 'DESC']],
                    limit,
                    offset,
                    subQuery: false 
                }),
                model.count({
                    include: countIncludes, 
                    where: pureWhereClause,
                    distinct: true, 
                    col: 'id',
                    subQuery: false
                })
            ]);

            // 7. Tính toán phân trang
            const totalPages = Math.ceil(total / limit);
            const pagination = {
                totalPages,
                currentPage: parseInt(pageNum),
                pageSize: limit,
                totalItems: total,
            };

            // 8. Định dạng dữ liệu trả về
            const data = treetments.map(treetMent => recalculateAmount(treetMent.toJSON()));
            
            return { data, pagination };

        } catch (error) {
            console.error('Lỗi tại getReExamByDate_v2:', error);
            throw error; 
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
                    .then(async () => { // Thêm async ở đây nếu cần an toàn
                        return await t.commit(); // Nên await commit
                    })
                    .catch(async (err) => { // 🌟 BẮT BUỘC phải thêm async ở đây
                        console.log(err + ' tại func thêm phieudieutri_congdichv');
                        await t.rollback(); // Bây giờ lệnh này mới chạy chính xác
                        throw Error(err);
                    });
            });
        }
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
                            .then(async () => {
                                return await t.commit(); // Thêm await để đảm bảo đã lưu xong dữ liệu
                            })
                            .catch(async (err) => { // 🌟 BẮT BUỘC: Thêm async ở đây để chạy được await bên dưới
                                console.log(err + ' tại func thêm phieudieutri_sanpham');
                                await t.rollback(); // Kết nối sẽ được giải phóng an toàn tại đây
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
                {
                    model: Thanhvien, as: 'nguoitao', attributes: ['id', 'tendaydu']
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
                    required: false,
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
            await giasuc.update(params,
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
                        model: Thanhvien, as: 'nguoitao', attributes: ['id', 'tendaydu']
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
   getPetExaminationPaging: async (pageSize, pageNum, phone, name, address, petName, isAdmin) => {
    const limit = parseInt(pageSize) || 20;
    const offset = (parseInt(pageNum) - 1) * limit;

    const phoneParam = phone || '';
    const nameParam = name || '';
    const addressParam = address || '';
    const pet = petName || '';
    
    const pTreatmentOption = {};
    if (!isAdmin) pTreatmentOption.option = 0;

    // 1. Bộ lọc khách hàng
    const khachhangOr = [];
    if (phoneParam) khachhangOr.push({ sodienthoai: { [Op.like]: `%${phoneParam}%` } });
    if (nameParam) khachhangOr.push({ ten: { [Op.like]: `%${nameParam}%` } });
    if (addressParam) khachhangOr.push({ diachi: { [Op.like]: `%${addressParam}%` } });
    const hasCustomerFilter = khachhangOr.length > 0;
    const khachhangWhere = hasCustomerFilter ? { [Op.or]: khachhangOr } : undefined;

    // 2. Bộ lọc thú cưng
    const giasucWhere = {
        trangthai: 1,
        ten: { [Op.like]: `%${pet}%` }
    };

    // 3. Mảng bao gồm đầy đủ dữ liệu cho lệnh findAll (Lấy dữ liệu hiển thị)
    const fullIncludesForData = [
        {
            model: khachhang,
            as: 'khachhang',
            ...(hasCustomerFilter && { where: khachhangWhere, required: true })
        },
        {
            model: phieudieutri,
            where: { trangthai: 1, ...pTreatmentOption },
            required: true 
        },
        {
            model: Giong,
            as: 'giong',
            include: [{ model: Chungloai, as: 'chungloai' }],
        }
    ];

    try {
        let petsData = [];
        let total = 0;

        if (!isAdmin) {
            // --- XỬ LÝ CHO USER THƯỜNG (CẦN LỌC PHIẾU VÀ ĐẾM SỐ PHIẾU > 1) ---

            // Mảng include rút gọn tối đa dành riêng cho câu lệnh COUNT để chống ETIMEDOUT
            const minimalIncludesForCount = [
                {
                    model: phieudieutri,
                    where: { trangthai: 1, ...pTreatmentOption },
                    attributes: [], // Không lấy bất kỳ cột nào của bảng phieudieutri
                    required: true
                }
            ];
            if (hasCustomerFilter) {
                minimalIncludesForCount.push({
                    model: khachhang,
                    as: 'khachhang',
                    where: khachhangWhere,
                    attributes: [], // Không lấy bất kỳ cột nào của bảng khachhang
                    required: true
                });
            }

            // Kích hoạt song song
            const [dataQuery, totalResult] = await Promise.all([
                giasuc.findAll({
                    include: fullIncludesForData,
                    where: giasucWhere,
                    order: [['ngaytao', 'DESC']],
                    limit,
                    offset,
                    subQuery: false,
                    group: ['giasuc.id'],
                    having: sequelize.literal('COUNT(phieudieutris.id) > 1')
                }),
                giasuc.findAll({
                    attributes: ['id'], // CHỈ LẤY ĐÚNG CỘT ID ĐỂ ĐẾM, BỎ HẾT CÁC CỘT KHÁC
                    include: minimalIncludesForCount, // Dùng include siêu sạch, bỏ giong/chungloai
                    where: giasucWhere,
                    subQuery: false,
                    group: ['giasuc.id'],
                    having: sequelize.literal('COUNT(phieudieutris.id) > 1'),
                    raw: true
                })
            ]);

            petsData = dataQuery;
            total = totalResult.length;

        } else {
            // --- XỬ LÝ CHO ADMIN (CHỈ CẦN PHÂN TRANG THÔNG THƯỜNG, ĐẾM NHANH CHÓNG) ---
            const [dataQuery, countQuery] = await Promise.all([
                giasuc.findAll({
                    include: fullIncludesForData,
                    where: giasucWhere,
                    order: [['ngaytao', 'DESC']],
                    limit,
                    offset,
                    subQuery: false
                }),
                giasuc.count({
                    include: hasCustomerFilter ? [{ model: khachhang, as: 'khachhang', where: khachhangWhere, required: true }] : [],
                    where: giasucWhere,
                    distinct: true,
                    col: 'id',
                    subQuery: false
                })
            ]);

            petsData = dataQuery;
            total = countQuery;
        }

        // 6. Tính toán phân trang
        const totalPages = Math.ceil(total / limit);
        const pagination = {
            totalPages,
            currentPage: parseInt(pageNum),
            pageSize: limit,
            totalItems: total,
        };

        return { data: petsData, pagination };

    } catch (error) {
        console.error('Lỗi tại getPetExaminationPaging:', error);
        throw error;
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