const khachhang = require('../../database/models/khachhang');
const giasuc = require('../../database/models/giasuc');
const chungloai = require('../../database/models/chungloai');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");
const Nhomkhachhang = require('../../database/models/nhomkhachhang');
const Giong = require('../../database/models/giong');
const { localDate } = require('../../utils/localDate');

module.exports = {
    // Creating khachhang
    create: async(body) => {
        let res = body;
        try {
            let id = await khachhang.create({
                ngaytao: localDate(new Date()),
                ten: res.ten,
                nguoitao_id: res.nguoitao_id,
                trangthai: 1,
                diachi: res.diachi,
                sodienthoai: res.sodienthoai,
                ghichu: res.ghichu,
                nhomkhachhang_id: res.nhomkhachhang_id
            }).then(res => {
                return res.dataValues.id;
            });
            if (res.thucung.length !== 0 || res.thucung.length !== '') {
                let arr = [];
                for (let index = 0; index < res.thucung.length; index++) {
                    const element = res.thucung[index];
                    let obj = {
                        ten: "",
                        tuoi: 0,
                        trongluong: 0,
                        khachhang_id: 0,
                        taikham: 0,
                        gioitinh: 0,
                        nguoitao_id: 0,
                        trangthai: 1,
                        dacdiem: "",
                        chungloai_id: 0,
                    }
                    obj = new Object();
                    obj.ten = element.ten;
                    obj.tuoi = element.tuoi;
                    obj.trongluong = element.trongluong;
                    obj.khachhang_id = id;
                    obj.taikham = element.taikham;
                    obj.gioitinh = element.gioitinh;
                    obj.nguoitao_id = element.nguoitao_id;
                    obj.trangthai = element.trangthai;
                    obj.dacdiem = element.dacdiem;
                    obj.chungloai_id = element.chungloai_id;
                    arr.push(obj)
                    await giasuc.bulkCreate(arr);
                }
            }
        } catch (error) {
            return error
        }
    },

    // },
    // Updating khachhang
    // update: async(res) => {
    //     console.log(khachhang);
    //     try {
    //         return await khachhang.update({
    //             name: res.name,
    //             email: res.email,
    //             category_id: res.category_id,
    //             phone_number: res.phone_number
    //         }, {
    //             where: {
    //                 id: res.id
    //             }
    //         })
    //     } catch (error) {
    //         return error
    //     }

    // },
    // get one khachhang
    getOne: async(id) => {
        try {
            return await khachhang.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many khach hang
    getMany: async(body) => {
        try {
            return await khachhang.findAll({
                distinct: true,
                group: ['sodienthoai'],
                include: [{
                    model: giasuc,
                    as: 'giasuc',
                    where: {
                        trangthai: true
                    }
                }],
                order: [
                    ['ngaytao', 'DESC']
                ],
                limit: 500
            })
        } catch (error) {
            return error
        }
    },
    // disable khachhang
    disable: async(id) => {
        try {
            return await khachhang.update({
                trangthai: 0
            }, {
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // disable khachhang
    getAll: async() => {
        try {
            return await khachhang.findAll({
                distinct: true,
                group: ['sodienthoai'],
                include: [{
                    model: giasuc,
                    as: 'giasuc',
                    where: {
                        trangthai: 1
                    },
                    required: false,
                    include: {
                        model: chungloai,
                        attributes: ['id', 'ten'],
                        as: 'chungloai'
                    },
                    include: {
                        model: Giong,
                        attributes: ['id', 'ten'],
                        as: 'giong',
                        include: {
                            attributes: ['id', 'ten'],
                            model: chungloai
                        }
                    }
                }, {
                    model: Nhomkhachhang,
                    as: 'nhomkhachhang'
                }],
                order: [
                    ['ngaytao', 'DESC']
                ],
                where: { trangthai: true }
            });
        } catch (error) {
            return error
        }
    },

    createNewCustomer: async(body) => {
        let res = body;
        try {
            return await khachhang.create({
                ten: res.ten,
                nguoitao_id: res.nguoitao_id,
                trangthai: 1,
                diachi: res.diachi,
                sodienthoai: res.sodienthoai,
                ghichu: res.ghichu,
                nhomkhachhang_id: res.nhomkhachhang_id,
                email: res.email
            }).then(res => {
                return res.dataValues.id;
            });
        } catch (error) {
            throw new Error();
        }
    },

    updateCustomer: async(body) => {
        let res = body;
        try {
            return await khachhang.update({
                ten: res.ten,
                trangthai: 1,
                diachi: res.diachi,
                sodienthoai: res.sodienthoai,
                ghichu: res.ghichu,
                nhomkhachhang_id: res.nhomkhachhang_id,
                email: res.email
            }, {
                where: {
                    id: res.id
                }
            }).then(res => {
                return res;
            });
        } catch (error) {
            throw new Error();
        }
    },


    createNewPet: async(body) => {
        let res = body;
        try {
            if (res.thucung.length !== 0 || res.thucung.length !== '') {
                let arr = [];
                for (let index = 0; index < res.thucung.length; index++) {

                    const element = res.thucung[index];
                    if (element.id === 0) {
                        let obj = {
                            ten: "",
                            tuoi: 0,
                            trongluong: 0,
                            khachhang_id: 0,
                            taikham: 0,
                            gioitinh: 0,
                            nguoitao_id: 0,
                            trangthai: 1,
                            dacdiem: "",
                            chungloai_id: 0,
                        }
                        obj = new Object();
                        obj.ten = element.ten;
                        obj.tuoi = element.tuoi;
                        obj.trongluong = element.trongluong;
                        obj.khachhang_id = res.id;
                        obj.gioitinh = element.gioitinh === "true" ? true : false;
                        obj.nguoitao_id = element.nguoitao_id;
                        obj.trangthai = element.trangthai;
                        obj.dacdiem = element.dacdiem;
                        obj.chungloai_id = element.chungloai_id;
                        arr.push(obj)
                    }
                }
                // return await giasuc.sequelize.transaction().bulkCreate(arr);

                return sangiasucpham.sequelize.transaction().then(async t => {
                    return await giasuc.bulkCreate(arr, { transaction: t }).then(() => {
                        t.commit();
                    }).catch((err) => {
                        t.rollback();
                        throw new Error(err);
                    })
                })
            }
        } catch (error) {
            throw new Error();
        }
    },

    // disable khachhang
    disablePet: async(id) => {
        try {
            return await giasuc.update({
                trangthai: 0
            }, {
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },


    import: async(data) => {
        // console.log(data);
        try {
            let khachhangObj = {
                    ngaytao: localDate(new Date()),
                    ten: "",
                    nguoitao_id: 1,
                    trangthai: 1,
                    diachi: "",
                    sodienthoai: "",
                    ghichu: "",
                    nhomkhachhang_id: 3,
                    ngaytao: "",
                    ngaysua: ""
                }
                // let thucungObj = {
                //     ten: "",
                //     tuoi: 0,
                //     trongluong: 0,
                //     khachhang_id: 0,
                //     taikham: 0,
                //     gioitinh: 0,
                //     nguoitao_id: 0,
                //     trangthai: 1,
                //     dacdiem: "",
                //     chungloai_id: 0,
                // }
            let list = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                khachhangObj = new Object();
                khachhangObj.ten = element.TenChu;
                khachhangObj.nguoitao_id = 1;
                khachhangObj.nhomkhachhang_id = 1
                khachhangObj.diachi = element.DiaChi;
                khachhangObj.sodienthoai = element.DienThoai;
                khachhangObj.trangthai = 1;
                khachhangObj.ngaytao = element.NgayPhatSinh;
                khachhangObj.ngaysua = element.NgaySuaDoi;
                list.push(khachhangObj);
            }
            return khachhang.sequelize.transaction().then(async t => {
                return await khachhang.bulkCreate(list, { transaction: t }).then(() => {
                    t.commit();
                }).catch((err) => {
                    console.log(err);
                    t.rollback();
                    throw new Error(err);
                })
            })
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    importPet: async(data) => {
        try {
            let thucungObj = {
                ten: "",
                tuoi: 0,
                trongluong: 0,
                khachhang_id: 0,
                taikham: 0,
                gioitinh: 0,
                nguoitao_id: 0,
                trangthai: 1,
                dacdiem: "",
                giong_id: 76,
                ngaysua: "",
                trangthai: 1,
                phieudieutriid: "",
            }
            let list = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let khID = 7570;
                let giong = 76;
                let kh = await khachhang.findOne({
                        where: {
                            sodienthoai: element.DienThoai
                        }
                    })
                    // console.log(kh.dataValues.get({ plain: 'text' }) + " id khác hàng");
                if (element.Giong !== null) {
                    let gi = await Giong.findOne({
                        where: {
                            ten: element.Giong.TenGiong
                        }
                    })
                    if (gi) {
                        if (gi.dataValues) {
                            if (gi.dataValues.id)
                                giong = gi.dataValues.id
                        }
                    }
                }
                console.log(kh.dataValues + " id khác hàng");
                if (kh) {
                    if (kh.dataValues) {
                        if (kh.dataValues.id)
                            khID = kh.dataValues.id
                    }
                }
                thucungObj = new Object();
                thucungObj.khachhang_id = khID;
                thucungObj.ten = element.TenGiaSuc;
                if (element.thongtin.length > 0) {
                    thucungObj.tuoi = element.thongtin[0].Tuoi
                    thucungObj.trongluong = element.thongtin[0].TrongLuong
                    for (let a = 0; a < element.thongtin.length; a++) {
                        let value = element.thongtin[a].PhieuDieuTriId
                        thucungObj.phieudieutriid += " " + value
                    }
                } else {
                    thucungObj.tuoi = 1
                    thucungObj.trongluong = 1
                    thucungObj.phieudieutriid = ""
                }
                thucungObj.gioitinh = element.GioiTinh;
                thucungObj.nguoitao_id = 1;
                thucungObj.trangthai = element.Xoa;
                thucungObj.giong_id = giong;
                thucungObj.ngaytao = element.NgayPhatSinh;
                thucungObj.ngaysua = element.NgaySuaDoi;
                list.push(thucungObj);
            }
            return giasuc.sequelize.transaction().then(async t => {
                await giasuc.bulkCreate(list, { transaction: t }).then(() => {
                    t.commit();
                }).catch((err) => {
                    console.log(err);
                    t.rollback();
                    throw new Error(err);
                })
            })
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    locKH: async() => {
        try {
            let a = await khachhang.findAll({
                distinct: true,
                group: ['sodienthoai'],
                include: [{
                    model: giasuc,
                    as: 'giasuc'
                }]
            });
            let arr = [];
            for (let index = 0; index < a.length; index++) {
                const element = a[index];
                if (element.dataValues.giasuc.length < 1) {
                    console.log(element.dataValues.id);
                    arr.push(element.dataValues.id);
                }

            }
            console.log(arr);
            console.log(arr.length);
            // await khachhang.destroy({
            //     where: { id: arr }
            // });
            // return res.dataValues.id;
            // });
        } catch (error) {
            throw new Error();
        }
    },
}