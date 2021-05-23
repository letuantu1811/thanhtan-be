const khachhang = require("./../../database/models/khachhang");
const giasuc = require("./../../database/models/giasuc");
const nhomsanpham = require("./../../database/models/nhomsanpham");
const phieudieutri_congdichvu = require("./../../database/models/phieudieutri_congdichvu");
const phieudieutri_sanpham = require("./../../database/models/phieudieutri_sanpham");
const phieudieutri = require("./../../database/models/phieudieutri");
const { localDate } = require("../../utils/localDate");
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
module.exports = {



    existed: async(body) => {
        let res = body;
        let pdtID = await create_phieudieutri(res);
        // update khach hang
        await khachhang.update({
            ten: res.khachhang.ten,
            diachi: res.khachhang.diachi,
            sodienthoai: res.khachhang.sodienthoai
        }, {
            where: {
                id: res.khachhang.id
            }
        }).then(res => {
            console.log(res + " update khach hang at taohoso");
        });

        //update thu cung
        await giasuc.update({
            ten: res.thucung.ten,
            trongluong: res.thucung.trongluong,
            dacdiem: res.thucung.dacdiem,
            tuoi: res.thucung.tuoi,
            gioitinh: res.thucung.gioitinh,
            chungloai_id: res.thucung.chungloai.id === 0 ? null : res.thucung.chungloai.id,
            giong_id: res.thucung.giong.id === 0 ? null : res.thucung.giong.id
        }, {
            where: {
                id: res.thucung.id
            }
        }).then(res => {
            console.log(res);
        });



        await create_phieudieutri_sanpham(pdtID, res.dsSP).then(async res => {
            console.log(res + " tại create_phieudieutri_sanpham");
        });
        await create_phieudieutri_congdichvu(pdtID, res.dsCDV).then(res => {
            console.log(res + " tại create_phieudieutri_congdichvu ");
        });


    },



    already: async(body) => {
        try {

            console.log("already");
            let res = body;
            // update khach hang
            await khachhang.update({
                ten: res.khachhang.ten,
                diachi: res.khachhang.diachi,
                sodienthoai: res.khachhang.sodienthoai
            }, {
                where: {
                    id: res.khachhang.id
                }
            }).then(res => {
                console.log(res + " update khach hang at taohoso");
            });

            //update thu cung
            let gsID = await giasuc.create({
                ten: res.thucung.ten,
                trongluong: res.thucung.trongluong,
                dacdiem: res.thucung.dacdiem,
                tuoi: res.thucung.tuoi,
                gioitinh: res.thucung.gioitinh,
                chungloai_id: res.thucung.chungloai.id !== 0 ? res.thucung.chungloai.id : null,
                giong_id: res.thucung.giong.id === 0 ? null : res.thucung.giong.id,
                khachhang_id: res.khachhang.id,
                ngaytao: localDate(new Date()),
            }).then(res => {
                console.log(res);
                return res.dataValues.id;
            });
            res.thucung.id = gsID;
            console.log(res);
            let pdtID = await create_phieudieutri(res);



            await create_phieudieutri_sanpham(pdtID, res.dsSP).then(async res => {
                console.log(res + " tại create_phieudieutri_sanpham");
            });
            await create_phieudieutri_congdichvu(pdtID, res.dsCDV).then(res => {
                console.log(res + " tại create_phieudieutri_congdichvu ");
            });
        } catch (error) {
            log.error(error)
            throw new Error()
        }
    },

    new: async(body) => {
        console.log("already");
        let res = body;
        // update khach hang
        let khID = await khachhang.create({
            ten: res.khachhang.ten,
            diachi: res.khachhang.diachi,
            sodienthoai: res.khachhang.sodienthoai,
            ngaytao: localDate(new Date())
        }).then(res => {
            console.log(res + " create khach hang at taohoso");
            return res.dataValues.id;
        });
        console.log(khID);
        //update thu cung
        let gsID = await giasuc.create({
            ten: res.thucung.ten,
            trongluong: res.thucung.trongluong,
            dacdiem: res.thucung.dacdiem,
            tuoi: res.thucung.tuoi,
            gioitinh: res.thucung.gioitinh,
            chungloai_id: res.thucung.chungloai.id !== 0 ? res.thucung.chungloai.id : null,
            giong_id: res.thucung.giong.id === 0 ? null : res.thucung.giong.id,
            khachhang_id: khID,
            ngaytao: localDate(new Date())
        }).then(res => {
            console.log(res);
            return res.dataValues.id;
        });
        res.thucung.id = gsID;
        res.khachhang.id = khID;
        console.log(res);
        let pdtID = await create_phieudieutri(res);



        await create_phieudieutri_sanpham(pdtID, res.dsSP).then(async res => {
            console.log(res + " tại create_phieudieutri_sanpham");
        });
        await create_phieudieutri_congdichvu(pdtID, res.dsCDV).then(res => {
            console.log(res + " tại create_phieudieutri_congdichvu ");
        });

    },
};

async function create_phieudieutri(body) {
    return await phieudieutri.create({
        sophieudieutri: body.sophieudieutri,
        dataikham: body.taikham ? 1 : null,
        trieuchung: body.trieuchung,
        chandoan: body.chandoan,
        ghichu: body.ghichu,
        thanhtien: body.thanhtien,
        ngaytaikham: body.ngaytaikham,
        khachhang_id: body.khachhang.id,
        giasuc_id: body.thucung.id,
        bacsi_id: body.bacsiID,
        noidung: JSON.stringify(body),
        ngaytao: localDate(new Date()),
    }).then(async res => {
        return res.dataValues.id;
    })
};

async function create_phieudieutri_sanpham(pdtID, listSP) {
    try {
        let arr = [];
        for (let index = 0; index < listSP.length; index++) {
            const element = listSP[index];
            let obj = {
                phieudieutri_id: 0,
                sanpham_id: 0,
                ngaytao: localDate(new Date())
            }
            obj = new Object();
            obj.phieudieutri_id = pdtID;
            obj.sanpham_id = element.id;
            obj.ngaytao = localDate(new Date());
            arr.push(obj)
        }

        await phieudieutri_sanpham.bulkCreate(arr);
    } catch (error) {
        console.log(error);
    }
};

async function create_phieudieutri_congdichvu(pdtID, listCDV) {
    try {
        let arr = [];
        for (let index = 0; index < listCDV.length; index++) {
            const element = listCDV[index];
            let obj = {
                phieudieutri_id: 0,
                congdichvu_id: 0,
                ngaytao: localDate(new Date())
            }
            obj = new Object();
            obj.phieudieutri_id = pdtID;
            obj.congdichvu_id = element.id;
            obj.ngaytao = localDate(new Date());
            arr.push(obj)
        }
        await phieudieutri_congdichvu.bulkCreate(arr);
    } catch (error) {
        console.log(error);
    }
};