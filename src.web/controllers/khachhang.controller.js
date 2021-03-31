const khachhang = require('../../database/models/khachhang');
const giasuc = require('../../database/models/giasuc');
const chungloai = require('../../database/models/chungloai');
const { ENUM } = require('../../utils/index');
const { Op, where } = require("sequelize");
const Nhomkhachhang = require('../../database/models/nhomkhachhang');

module.exports = {
    // Creating khachhang
    create: async(body) => {
        let res = body;
        try {
            let id = await khachhang.create({
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
        let limit = body.limit;
        let offset = body.offset;
        let quyen = body.quyen;
        try {
            return await khachhang.findAll({
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
                offset: offset,
                limit: limit
            })
        } catch (error) {
            return error
        }
    },
    // disable khachhang
    disable: async(id) => {
        try {
            return await khachhang.update({
                state: ENUM.DISABLE
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
                    }
                }, {
                    model: Nhomkhachhang,
                    as: 'nhomkhachhang'
                }],
                order: [
                    ['ngaytao', 'DESC']
                ],
            });
        } catch (error) {
            return error
        }
    }
}