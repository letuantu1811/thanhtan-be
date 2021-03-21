const model = require('../../database/models/phieudieutri');
const khachhang = require('../../database/models/khachhang');
const giasuc = require('../../database/models/giasuc');
const congdichvu = require('../../database/models/congdichvu');
const { ENUM } = require('../../utils/index');
const phieudieutri = require('../../database/models/phieudieutri');
const phieudieutri_congdichvu = require('../../database/models/phieudieutri_congdichvu');
const phieudieutri_sanpham = require('../../database/models/phieudieutri_sanpham');
// const { Op } = require("sequelize");

module.exports = {
    // Creating model
    create: async(res) => {
        console.log(model);
        try {
            return await model.create({
                khachhang_id: res.guest_id,
                nguoitao_id: res.user_id,
                trieuchung: res.description,
                ghichu: res.note,
                ngaytaikham: res.re_examination,
                dataikham: res.status_examination,
                congdichvu: res.service_plus,
                thanhtien: res.total
            })
        } catch (error) {
            return error
        }
    },

    createHoSo: async(res) => {
        try {
            if (res.khachhang.id === 100) {
                // update khach hang
                await khachhang.update({
                    ten: res.khachhang.ten,
                    diachi: res.khachhang.diachi,
                    sodienthoai: res.khachhang.sodienthoai,
                    where: {
                        id: res.khachhang.id
                    }
                }).then(res => {
                    console.log(res + " update khach hang at taohoso");
                })
                if (res.thucung.id !== 0) {
                    //update thu cung
                    await giasuc.update({
                        ten: res.thucung.ten,
                        trongluong: res.thucung.trongluong,
                        giong: res.thucung.giong,
                        tuoi: res.thucung.tuoi,
                        gioitinh: res.thucung.gioitinh,
                        chungloaiName: res.thucung.chungloaiName,
                        where: {
                            id: res.thucung.id
                        }
                    }).then(res => {
                        console.log(res);
                    })
                } else {
                    // creaete thu cung 

                }
            } else {
                // create khach hang
            }
            await phieudieutri.create({
                    nguoitao_id: res.bacsiID,
                    khachhang_id: res.khachhang.id,
                    giasuc_id: res.thucung.id,
                    trieuchung: res.triuchung,
                    chandoan: res.chandoan,
                    ghichu: res.ghichu,
                    ngaytaikham: res.ngaytaikham,
                    noidung: JSON.stringify(res)
                }).then(res => {
                    console.log(res);
                })
                // {
                //     "khachhang": {
                //         "id": 1,
                //         "ten": "Nguyễn Công Sơn",
                //         "diachi": "Gò Vấp",
                //         "sodienthoai": "0935320248"
                //     },
                //     "thucung": {
                //         "id": 3,
                //         "trongluong": 1,
                //         "giong": "Bulldog size L",
                //         "tuoi": 2,
                //         "gioitinh": false,
                //         "chungloaiName": "Chó ta",
                //         "chungloai": {
                //             "ten": "Chó ta"
                //         },
                //         "ten": "TUONG"
                //     },
                //     "dsCDV": [
                //         {
                //             "gia": "100000",
                //             "id": 2,
                //             "ten": "Thiến"
                //         },
                //         {
                //             "gia": "40000",
                //             "id": 1,
                //             "ten": "Tiêm"
                //         }
                //     ],
                //     "dsSP": [
                //         {
                //             "gia": 3000,
                //             "soluong": 1,
                //             "id": 9,
                //             "ten": "Benebac plus 15g",
                //             "donvitinh": {
                //                 "id": 23,
                //                 "ten": "Cái",
                //                 "nguoitao_id": 1,
                //                 "trangthai": true,
                //                 "ngaytao": "2021-01-30T02:31:58.000Z",
                //                 "ngaysua": "2021-01-30T02:31:58.000Z"
                //             }
                //         },
                //         {
                //             "gia": 2000,
                //             "soluong": 1,
                //             "id": 8,
                //             "ten": "Auriderm",
                //             "donvitinh": {
                //                 "id": 22,
                //                 "ten": "Gram",
                //                 "nguoitao_id": 1,
                //                 "trangthai": true,
                //                 "ngaytao": "2021-01-25T19:29:51.000Z",
                //                 "ngaysua": "2021-01-25T19:29:51.000Z"
                //             }
                //         }
                //     ],
                //     "triuchung": "112",
                //     "chandoan": "1221",
                //     "ghichu": "",
                //     "thanhtien": 145000,
                //     "ngaytaikham": "2021-03-23",
                //     "chungloai": "",
                //     "giong": "",
                //     "bacsiId": "0"
                // }
        } catch (error) {
            console.log(error);
            return error
        }
    },

    // get one model
    getOne: async(id) => {
        try {
            return await model.findOne({
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
        try {
            return await model.findAll({
                where: {
                    state: quyen == "admin" ? "" : ENUM.ENABLE
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
    // disable model
    disable: async(id) => {
        try {
            return await model.update({
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
    // disable model
    getAll: async() => {
        try {
            return await model.findAll();
        } catch (error) {
            return error
        }
    }
}