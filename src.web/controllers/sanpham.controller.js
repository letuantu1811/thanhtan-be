const sanpham = require('../../database/models/sanpham');
const nhomsanpham = require('../../database/models/nhomsanpham');
const donvitinh = require('../../database/models/donvitinh');
const { ENUM } = require('../../utils/index');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const { localDate } = require('../../utils/localDate');
const giasuc = require('../../database/models/giasuc');
const { generateBarcode } = require('../services/productService');
const response = require('../../utils/api.res/response');
const { getMessage } = require('../../utils/api.res/message');

module.exports = {
    create: async (res) => {
        console.log(sanpham);
        try {
            if (res.thucung.length !== 0 || res.thucung.length !== '') {
                const arr = [];
                for (let index = 0; index < res.thucung.length; index++) {
                    const element = res.thucung[index];
                    const obj = {
                        ten: '',
                        ngaytao: '',
                        tuoi: 0,
                        trongluong: 0,
                        khachhang_id: 0,
                        taikham: 0,
                        gioitinh: 0,
                        nguoitao_id: 0,
                        trangthai: 1,
                        dacdiem: '',
                        chungloai_id: 0,
                        mavach: '',
                    };
                    obj.ngaytao = localDate(new Date());
                    obj.ten = element.ten;
                    obj.tuoi = element.tuoi;
                    obj.trongluong = element.trongluong;
                    obj.khachhang_id = element.khachhang_id || null;
                    obj.taikham = element.taikham;
                    obj.gioitinh = element.gioitinh;
                    obj.nguoitao_id = element.nguoitao_id;
                    obj.trangthai = element.trangthai;
                    obj.dacdiem = element.dacdiem;
                    obj.chungloai_id = element.chungloai_id;
                    obj.mavach = element.mavach;
                    arr.push(obj);
                    await giasuc.bulkCreate(arr);
                }
            }
        } catch (error) {
            return error;
        }
    },

    createMulti: async (listSP) => {
        try {
            const arrNew = [];
            let obj = {
                ten: '',
                tenthaythe: '',
                nhacungcap: '',
                nhomsanpham_id: 0,
                nguoitao_id: 1,
                trangthai: 1,
                donvitinh_id: 0,
                donviquydoi_id: 0,
                giatriquydoi: 0,
                gianhap: 0,
                soluong: 0,
                soluongtoithieu: 0,
                gia: 0,
                ngaytao: '',
            };
            for (let index = 0; index < listSP.length; index++) {
                const res = listSP[index];
                if (res.id === '0' || res.id === 0 || res.id === null) {
                    obj = new Object();
                    obj.ngaytao = localDate(new Date());
                    obj.ten = res.tenhanghoa;
                    obj.tenthaythe = res.tenthaythe;
                    obj.nhomsanpham_id =
                        Number.parseInt(res.nhomsanpham.id) === 0
                            ? 27
                            : Number.parseInt(res.nhomsanpham.id);
                    obj.nguoitao_id =
                        res.nguoitao_id !== undefined && res.nguoitao_id !== 0
                            ? res.nguoitao_id
                            : 1;
                    obj.trangthai = 1;
                    obj.nhacungcap = res.nhacungcap;
                    obj.soluongtoithieu = res.soluongtoithieu;
                    obj.donvitinh_id = Number.parseInt(res.donvitinh.id);
                    obj.donviquydoi_id = Number.parseInt(res.donviquydoi_id);
                    obj.giatriquydoi = Number.parseInt(res.giatriquydoi);
                    obj.gianhap = res.gianhap
                        ? Number.parseInt(res.gianhap.split(',').join(''))
                        : 0;
                    obj.gia = Number.parseInt(res.gia.split(',').join(''));
                    obj.soluong = res.soluong + Number.parseInt(res.soluongthem);
                    arrNew.push(obj);
                } else {
                    obj = new Object();
                    obj.ngaytao = localDate(new Date());
                    obj.ten = res.tenhanghoa;
                    obj.tenthaythe = res.tenthaythe;
                    obj.nhomsanpham_id =
                        Number.parseInt(res.nhomsanpham.id) === 0
                            ? 27
                            : Number.parseInt(res.nhomsanpham.id);
                    obj.trangthai = 1;
                    obj.nhacungcap = res.nhacungcap;
                    obj.soluongtoithieu = res.soluongtoithieu;
                    obj.donvitinh_id = Number.parseInt(res.donvitinh.id);
                    obj.donviquydoi_id = Number.parseInt(res.donviquydoi.id);
                    obj.giatriquydoi = Number.parseInt(res.giatriquydoi);
                    obj.gianhap = Number.parseInt(res.gianhap.split(',').join(''));
                    obj.gia = Number.parseInt(res.gia.split(',').join(''));
                    obj.soluong = res.soluong + Number.parseInt(res.soluongthem);
                    await sanpham.sequelize.transaction().then(async (t) => {
                        return await sanpham
                            .update(
                                obj,
                                {
                                    where: {
                                        id: res.id,
                                    },
                                },
                                { transaction: t },
                            )
                            .then(() => {
                                return t.commit();
                            })
                            .catch((err) => {
                                t.rollback();
                                throw Error(err);
                            });
                    });
                }
            }
            if (arrNew.length > 0) {
                return sanpham.sequelize.transaction().then(async (t) => {
                    return await sanpham
                        .bulkCreate(arrNew, { transaction: t })
                        .then(() => {
                            return t.commit();
                        })
                        .catch((err) => {
                            console.log(
                                err +
                                    ' tại func thêm nhiều sản phẩm - row 94:sanpham.controller.js',
                            );
                            t.rollback();
                            throw Error(err);
                        });
                });
            }
        } catch (error) {
            console.log(error);
            throw Error(error);
        }
    },

    // get one sanpham
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
    // get many san pham
    getMany: async (body) => {
        const limit = body.limit;
        const offset = body.offset;
        const productGroupId = body.nhomsanpham_id || '';
        try {
            return await sanpham.findAll({
                where: {
                    nhomsanpham_id: productGroupId,
                },
                order: [['ngaytao', 'DESC']],
                offset: offset,
                limit: limit,
            });
        } catch (error) {
            return error;
        }
    },
    // disable sanpham
    disable: async (id) => {
        try {
            return sanpham.sequelize.transaction().then(async (t) => {
                return await sanpham
                    .update(
                        {
                            trangthai: ENUM.DISABLE,
                        },
                        {
                            where: {
                                id: id,
                            },
                        },
                        { transaction: t },
                    )
                    .then(() => {
                        t.commit();
                    })
                    .catch((err) => {
                        t.rollback();
                        throw new Error(err);
                    });
            });
        } catch (error) {
            throw new Error(error);
        }
    },
    // disable sanpham
    getAll: async (quyen) => {
        const role = quyen ? quyen.toUpperCase() : '';
        const isViewedNonRestricted = ['ADMIN', 'MANAGER'].includes(role);
        const an = isViewedNonRestricted ? {} : { an: 1 };
        try {
            const product = await sanpham.findAll({
                include: [
                    {
                        model: donvitinh,
                        as: 'donvitinh',
                        require: true,
                        attributes: {
                            exclude: ['trangthai', 'ngaytao', 'ngaysua'],
                        },
                    },
                    {
                        model: donvitinh,
                        as: 'donviquydoi',
                        require: true,
                        attributes: {
                            exclude: ['trangthai', 'ngaytao', 'ngaysua'],
                        },
                    },
                    {
                        model: nhomsanpham,
                        require: true,
                        attributes: {
                            exclude: ['trangthai', 'ngaytao', 'ngaysua'],
                        },
                    },
                ],
                where: {
                    trangthai: 1,
                    ...an,
                },
                order: [['ten', 'ASC']],
            });
            return product;
        } catch (error) {
            return error;
        }
    },

    // pagination products
    getAll_v2: async (quyen, pageSize, pageNum, productName, category) => {
        const role = quyen ? quyen.toUpperCase() : '';
        const isViewedNonRestricted = ['ADMIN', 'MANAGER'].includes(role);
        const an = isViewedNonRestricted ? {} : { an: 1 };
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;
        const product_name = productName ? productName : '';       
        const category_id = !category ? {} : { nhomsanpham_id: parseInt(category) };
        const defaultIncludes = [
            {
                model: donvitinh,
                as: 'donvitinh',
                require: true,
                attributes: {
                    exclude: ['trangthai', 'ngaytao', 'ngaysua'],
                },
            },
            {
                model: donvitinh,
                as: 'donviquydoi',
                require: true,
                attributes: {
                    exclude: ['trangthai', 'ngaytao', 'ngaysua'],
                },
            },
            {
                model: nhomsanpham,
                require: true,
                attributes: {
                    exclude: ['trangthai', 'ngaytao', 'ngaysua'],
                },
            },
        ]
        try {
            const product = await sanpham.findAll({
                include: [...defaultIncludes],
                where: {
                    trangthai: 1,
                    ...an,
                    [Op.or]: [
                        {
                            ten: { [Op.like]: `%${product_name}%` }
                        },
                        {
                            tenthaythe: { [Op.like]: `%${product_name}%` }
                        }
                    ],
                    ...category_id
                },
                order: [['ten', 'ASC']],
                limit,
                offset
            });
            const total = await sanpham.count({
                include: [...defaultIncludes],
                where: {
                    trangthai: 1,
                    ...an,
                    [Op.or]: [
                        {
                            ten: { [Op.like]: `%${product_name}%` }
                        },
                        {
                            tenthaythe: { [Op.like]: `%${product_name}%` }
                        }
                    ],
                    ...category_id
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
            return { product, pagination };
        } catch (error) {
            return error;
        }
    },


    getAllHiddenProduct: async () => {
        try {
            return await sanpham.findAll({
                include: [
                    {
                        attributes: ['id', 'ten'],
                        model: donvitinh,
                    },
                    {
                        attributes: ['id', 'ten'],
                        model: nhomsanpham,
                    },
                ],
                where: {
                    trangthai: 1,
                },
            });
        } catch (error) {
            return error;
        }
    },

    getAllMedicines: async (role) => {
        let obj = {};
        if (role.toUpperCase() !== 'ADMIN') {
            obj = { an: 0 };
        }
        try {
            return await sanpham.findAll({
                include: [
                    {
                        model: donvitinh,
                        where: {
                            trangthai: 1,
                        },
                        require: true,
                    },
                ],
                where: {
                    trangthai: true,
                    ...obj,
                },
            });
        } catch (error) {
            return error;
        }
    },

    getInventory: async () => {
        try {
            return await sanpham.findAll({
                include: [
                    {
                        attributes: ['id', 'ten'],
                        model: donvitinh,
                        as: 'donvitinh',
                    },
                    {
                        attributes: ['id', 'ten'],
                        model: nhomsanpham,
                    },
                ],
                where: {
                    trangthai: 1,
                    soluongtoithieu: {
                        [Op.gte]: sequelize.col('soluong'),
                    },
                },
            });
        } catch (error) {
            return error;
        }
    },

    update: async (body) => {
        const data = body;
        try {
            return sanpham.sequelize.transaction().then(async (t) => {
                return await sanpham
                    .update(
                        {
                            ten: data.tenhanghoa,
                            tenthaythe: data.tenthaythe,
                            nhacungcap: data.nhacungcap,
                            nhomsanpham_id: data.nhomsanpham_id,
                            donviquydoi_id: data.donviquydoi_id,
                            giatriquydoi: data.giatriquydoi,
                            donvitinh_id: data.donvitinh_id,
                            gia: data.gia,
                            gianhap: data.gianhap != null ? data.gianhap : 0,
                            soluongtoithieu: data.soluongtoithieu,
                            soluong: data.soluong,
                            soluongquydoiton: data.soluongquydoiton,
                            mavach: data.mavach,
                        },
                        {
                            where: {
                                id: data.id,
                            },
                        },
                        { transaction: t },
                    )
                    .then(() => {
                        t.commit();
                    })
                    .catch((err) => {
                        t.rollback();
                        throw new Error(err);
                    });
            });
        } catch (error) {
            throw new Error(error);
        }
    },

    importData: async (listSP) => {
        try {
            const arrNew = [];
            const donvitinhArr = await donvitinh.findAll();
            const nhomthuocArr = await nhomsanpham.findAll();

            let obj = {
                ten: '',
                tenthaythe: '',
                nhacungcap: '',
                nhomsanpham_id: 0,
                nguoitao_id: 1,
                trangthai: 1,
                donvitinh_id: 0,
                donviquydoi_id: 0,
                gianhap: 0,
                soluong: 0,
                soluongtoithieu: 0,
                giatriquydoi: 1,
                gia: 0,
                ngaytao: '',
            };
            for (let index = 0; index < listSP.length; index++) {
                const res = listSP[index];
                const donviquydoiid = donvitinhArr.filter(
                    (item) =>
                        item.ten.toUpperCase() === res.DonViTinhQuyDoi.TenDonViTinh.toUpperCase(),
                );
                const donvitinhid = donvitinhArr.filter(
                    (item) => item.ten.toUpperCase() === res.DonViTinh.TenDonViTinh.toUpperCase(),
                );
                const nhomthuocid = nhomthuocArr.filter(
                    (item) => item.ten.toUpperCase() === res.NhomThuoc.TenNhomThuoc.toUpperCase(),
                );
                // console.log(nhomthuocid[0].dataValues.id);
                // console.log(donvitinhid[0].dataValues.id);
                let ntid = 24;
                let dvtid = 56;
                let dvqdid = 56;
                if (nhomthuocid[0]) {
                    if (nhomthuocid[0].dataValues.id) {
                        ntid = nhomthuocid[0].dataValues.id;
                    }
                }
                if (donvitinhid[0]) {
                    if (donvitinhid[0].dataValues.id) {
                        dvtid = donvitinhid[0].dataValues.id;
                    }
                }
                if (donviquydoiid[0]) {
                    if (donviquydoiid[0].dataValues.id) {
                        dvqdid = donviquydoiid[0].dataValues.id;
                    }
                }
                obj = new Object();
                obj.ngaytao = localDate(new Date());
                obj.ten = res.TenThuoc;
                obj.tenthaythe = res.TenThuocKhac || res.TenThuoc;
                obj.nhomsanpham_id = ntid;
                obj.trangthai = res.Xoa ? 0 : 1;
                obj.soluongtoithieu = res.SLTonToiThieu;
                obj.donvitinh_id = dvtid;
                obj.donviquydoi_id = dvqdid;
                obj.giatriquydoi = Number.parseInt(res.GiaTriQuyDoi) || 1;
                obj.gianhap = res.DonGiaNhap;
                obj.ngaytao = res.NgayPhatSinh;
                obj.ngaysua = res.NgaySuaDoi;
                obj.gia = res.DonGiaBan;
                obj.soluong = 100;
                arrNew.push(obj);
            }
            if (arrNew.length > 0) {
                return sanpham.sequelize.transaction().then(async (t) => {
                    return await sanpham
                        .bulkCreate(arrNew, { transaction: t })
                        .then(() => {
                            return t.commit();
                        })
                        .catch((err) => {
                            console.log(
                                err +
                                    ' tại func thêm nhiều sản phẩm - row 94:sanpham.controller.js',
                            );
                            t.rollback();
                            throw Error(err);
                        });
                });
            }
        } catch (error) {
            throw Error(error);
        }
    },

    createOne: async (body) => {
        const data = body;
        try {
            return sanpham.sequelize.transaction().then(async (t) => {
                return await sanpham
                    .create(
                        {
                            ten: data.tenhanghoa,
                            tenthaythe: data.tenthaythe,
                            nhacungcap: data.nhacungcap,
                            nhomsanpham_id: data.nhomsanpham_id,
                            donviquydoi_id: data.donviquydoi_id,
                            giatriquydoi: data.giatriquydoi,
                            donvitinh_id: data.donvitinh_id,
                            gia: data.gia,
                            gianhap: data.gianhap != null ? data.gianhap : 0,
                            soluongtoithieu: data.soluongtoithieu,
                            soluong: data.soluong,
                            soluongquydoiton: data.soluongquydoiton,
                            mavach: data.mavach || '',
                        },
                        { transaction: t },
                    )
                    .then((x) => {
                        t.commit();
                        return x.id;
                    })
                    .catch((err) => {
                        t.rollback();
                        throw new Error(err);
                    });
            });
        } catch (error) {
            throw new Error(error);
        }
    },

    getAllForBarCode: async (quyen) => {
        let obj = {};
        if (quyen.toUpperCase() !== 'ADMIN') {
            obj = { an: 0 };
        }
        try {
            return await sanpham.findAll({
                attributes: ['id', 'ten', 'mavach', 'gia'],
                include: [
                    {
                        model: nhomsanpham,
                        attributes: ['ten'],
                        where: {
                            trangthai: 1,
                        },
                        require: true,
                    },
                ],
                where: {
                    trangthai: true,
                    ...obj,
                },
                order: [['ten', 'ASC']],
            });
        } catch (error) {
            return error;
        }
    },

    addBarcode: async (body) => {
        const data = body;
        try {
            return sanpham.sequelize.transaction().then(async (t) => {
                return await sanpham
                    .update(
                        {
                            mavach: data.mavach,
                        },
                        {
                            where: {
                                id: data.id,
                            },
                        },
                        { transaction: t },
                    )
                    .then(() => {
                        t.commit();
                    })
                    .catch((err) => {
                        t.rollback();
                        throw new Error(err);
                    });
            });
        } catch (error) {
            throw new Error(error);
        }
    },

    generateBarcode: async (req, res) => {
        try {
            const id = req.params.id;
            const updatedProduct = await generateBarcode(id);
            return response.success(res, getMessage('http.created'), updatedProduct);
        } catch (error) {
            return response.error(res, error.message, error.statusCode);
        }
    },
};
