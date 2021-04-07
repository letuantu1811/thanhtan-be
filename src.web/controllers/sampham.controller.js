const sanpham = require('../../database/models/sanpham');
const nhomsanpham = require('../../database/models/nhomsanpham');
const donvitinh = require('../../database/models/donvitinh');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");
const sequelize = require("sequelize");

module.exports = {
    // Creating sanpham
    create: async(res) => {
        console.log(sanpham);
        // try {
        //     return await sanpham.create({
        //         ten: res.ten,
        //         nhomsanpham_id: res.nhomsanpham_id,
        //         thuoc: res.thuoc,
        //         nguoitao_id: res.nguoitao_id,
        //         trangthai: res.trangthai,
        //         donvitinh_id: res.donvitinh_id,
        //         gianhap: res.gianhap,
        //         soluong: res.soluong
        //     })
        // } catch (error) {
        //     return error
        // }
        try {
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
                        giong: "",
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
                    obj.giong = element.giong;
                    obj.chungloai_id = element.chungloai_id;
                    arr.push(obj)
                    await giasuc.bulkCreate(arr);
                }
            }
        } catch (error) {
            return error
        }
    },
    createMulti: async(listSP) => {
        try {
            let arrUpdate = [];
            let arrNew = [];
            let obj = {
                ten: "",
                tenthaythe: "",
                nhacungcap: "",
                nhomsanpham_id: 0,
                nguoitao_id: 1,
                trangthai: 1,
                donvitinh_id: 0,
                gianhap: 0,
                soluong: 0,
                soluongtoithieu: 0,
                gia: 0
            }
            for (let index = 0; index < listSP.length; index++) {

                const res = listSP[index];
                if (res.id === "0" || res.id === 0 || res.id === null) {

                    obj = new Object();
                    obj.ten = res.tenhanghoa;
                    obj.tenthaythe = res.tenthaythe;
                    obj.nhomsanpham_id = Number.parseInt(res.nhomsanpham.id);
                    obj.nguoitao_id = (res.nguoitao_id !== undefined && res.nguoitao_id !== 0) ? res.nguoitao_id : 1;
                    obj.trangthai = 1;
                    obj.nhacungcap = res.nhacungcap;
                    obj.soluongtoithieu = res.soluongtoithieu
                    obj.donvitinh_id = Number.parseInt(res.donvitinh.id);
                    obj.gianhap = Number.parseInt(res.gianhap.split(",").join(""));
                    obj.gia = Number.parseInt(res.gia.split(",").join(""));
                    obj.soluong = res.soluong + Number.parseInt(res.soluongthem);
                    arrNew.push(obj);
                } else {
                    obj = new Object();
                    obj.ten = res.tenhanghoa;
                    obj.tenthaythe = res.tenthaythe;
                    obj.nhomsanpham_id = Number.parseInt(res.nhomsanpham.id);
                    obj.trangthai = 1;
                    obj.nhacungcap = res.nhacungcap;
                    obj.soluongtoithieu = res.soluongtoithieu
                    obj.donvitinh_id = Number.parseInt(res.donvitinh.id);
                    obj.gianhap = Number.parseInt(res.gianhap.split(",").join(""));
                    obj.gia = Number.parseInt(res.gia.split(",").join(""));
                    obj.soluong = res.soluong + Number.parseInt(res.soluongthem);
                    // arrNew.push(obj)
                    await sanpham.sequelize.transaction().then(async t => {
                        return await sanpham.update(obj, {
                            where: {
                                id: res.id
                            }
                        }, { transaction: t }).then(() => {
                            return t.commit();
                        }).catch(err => {
                            console.log(err + " tại func thêm nhiều sản phẩm - row 129:sanpham.controller.js");
                            t.rollback();
                            throw Error(err);
                        })
                    })
                }
            }
            if (arrNew.length > 0) {
                return sanpham.sequelize.transaction().then(async t => {
                    return await sanpham.bulkCreate(arrNew, { transaction: t }).then(() => {
                        return t.commit();
                    }).catch(err => {
                        console.log(err + " tại func thêm nhiều sản phẩm - row 94:sanpham.controller.js");
                        t.rollback();
                        throw Error(err);
                    })
                })
            }
        } catch (error) {
            throw Error(error);
        }
    },
    // Updating sanpham
    // update: async(res) => {
    //     console.log(sanpham);
    //     try {
    //         return await sanpham.update({
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
    // get one sanpham
    getOne: async(id) => {
        try {
            return await sanpham.findOne({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return error
        }
    },
    // get many san pham
    getMany: async(body) => {
        let limit = body.limit;
        let offset = body.offset;
        let quyen = body.quyen;
        let nhomsanpham_id = body.nhomsanpham_id || "";
        try {
            return await sanpham.findAll({
                where: {
                    nhomsanpham_id: nhomsanpham_id
                        // trangthai: quyen == "admin" ? "" : ENUM.ENABLE
                },
                order: [
                    ['ngaytao', 'DESC']
                ],
                offset: offset,
                limit: limit
            })
        } catch (error) {
            return error
        }
    },
    // disable sanpham
    disable: async(id) => {
        try {
            return await sanpham.update({
                trangthai: ENUM.DISABLE
            }, {
                where: {
                    id: res.id
                }
            })
        } catch (error) {
            return error
        }
    },
    // disable sanpham
    getAll: async() => {
        try {
            return await sanpham.findAll({
                include: [{
                        model: donvitinh,
                        where: {
                            trangthai: 1
                        },
                        require: false
                    },
                    {
                        model: nhomsanpham,
                        where: {
                            trangthai: 1
                        },
                        require: false
                    }
                ],
                order: [
                    ['ten', 'ASC']
                ]

            });
        } catch (error) {
            return error
        }
    },
    // get hidden product
    getAllHiddenProduct: async() => {
        try {
            return await sanpham.findAll({
                include: [{
                        attributes: ['id', 'ten'],
                        model: donvitinh
                    },
                    {
                        attributes: ['id', 'ten'],
                        model: nhomsanpham
                    }
                ],
                where: {
                    trangthai: 1
                }
            })
        } catch (error) {
            return error
        }
    },
    getAllMedicines: async() => {
        try {
            return await sanpham.findAll({
                include: [{
                    model: donvitinh,
                    where: {
                        trangthai: 1
                    }
                }],
                where: {
                    trangthai: 1
                },
                thuoc: 1
            });
        } catch (error) {
            return error
        }
    },
    getInventory: async() => {
        try {
            return await sanpham.findAll({
                include: [{
                        attributes: ['id', 'ten'],
                        model: donvitinh
                    },
                    {
                        attributes: ['id', 'ten'],
                        model: nhomsanpham
                    }
                ],
                where: {
                    trangthai: 1,
                    soluongtoithieu: {
                        [Op.gte]: sequelize.col('soluong')
                    }
                }
            });
        } catch (error) {
            return error
        }
    }
}