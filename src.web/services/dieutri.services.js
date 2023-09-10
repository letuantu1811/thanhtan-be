const khachhang = require('./../../database/models/khachhang');
const giasuc = require('./../../database/models/giasuc');
const nhomsanpham = require('./../../database/models/nhomsanpham');
const phieudieutri_congdichvu = require('./../../database/models/phieudieutri_congdichvu');
const phieudieutri_sanpham = require('./../../database/models/phieudieutri_sanpham');
const phieudieutri = require('./../../database/models/phieudieutri');
const { localDate } = require('../../utils/localDate');
const { toNumber } = require('lodash');

module.exports = {
    existed: async (body) => {
        const res = body;
        const healthFormId = await create_phieudieutri(res);
        // update khach hang
        await khachhang
            .update(
                {
                    ten: res.khachhang.ten,
                    diachi: res.khachhang.diachi,
                    sodienthoai: res.khachhang.sodienthoai,
                },
                {
                    where: {
                        id: res.khachhang.id,
                    },
                },
            )
            .then((res) => {
                console.log(res + ' update khach hang at taohoso');
            });

        // update thu cung
        await giasuc
            .update(
                {
                    ten: res.thucung.ten,
                    trongluong: res.thucung.trongluong,
                    dacdiem: res.thucung.dacdiem,
                    tuoi: res.thucung.tuoi,
                    gioitinh: res.thucung.gioitinh,
                    chungloai_id: res.thucung.chungloai.id === 0 ? null : res.thucung.chungloai.id,
                    giong_id: res.thucung.giong.id === 0 ? null : res.thucung.giong.id,
                },
                {
                    where: {
                        id: res.thucung.id,
                    },
                },
            )
            .then((res) => {
                console.log(res);
            });

        await create_phieudieutri_sanpham(healthFormId, res.dsSP).then(async (res) => {
            console.log(res + ' tại create_phieudieutri_sanpham');
        });
        await create_phieudieutri_congdichvu(healthFormId, res.dsCDV).then((res) => {
            console.log(res + ' tại create_phieudieutri_congdichvu ');
        });
    },

    already: async (body) => {
        try {
            const res = body;
            // update khach hang
            await khachhang
                .update(
                    {
                        ten: res.khachhang.ten,
                        diachi: res.khachhang.diachi,
                        sodienthoai: res.khachhang.sodienthoai,
                    },
                    {
                        where: {
                            id: res.khachhang.id,
                        },
                    },
                )
                .then((res) => {
                    console.log(res + ' update khach hang at taohoso');
                });

            // update thu cung
            const gsID = await giasuc
                .create({
                    ten: res.thucung.ten,
                    trongluong: res.thucung.trongluong,
                    dacdiem: res.thucung.dacdiem,
                    tuoi: res.thucung.tuoi,
                    gioitinh: res.thucung.gioitinh,
                    chungloai_id: res.thucung.chungloai.id !== 0 ? res.thucung.chungloai.id : null,
                    giong_id: res.thucung.giong.id === 0 ? null : res.thucung.giong.id,
                    khachhang_id: res.khachhang.id,
                    ngaytao: localDate(new Date()),
                })
                .then((res) => {
                    console.log(res);
                    return res.dataValues.id;
                });
            res.thucung.id = gsID;
            console.log(res);
            const healthFormId = await create_phieudieutri(res);

            await create_phieudieutri_sanpham(healthFormId, res.dsSP).then(async (res) => {
                console.log(res + ' tại create_phieudieutri_sanpham');
            });
            await create_phieudieutri_congdichvu(healthFormId, res.dsCDV).then((res) => {
                console.log(res + ' tại create_phieudieutri_congdichvu ');
            });
        } catch (error) {
            log.error(error);
            throw new Error();
        }
    },

    new: async (body) => {
        const res = body;
        try {
            const customerId = await khachhang
                .create({
                    ten: body.khachhang.ten,
                    diachi: body.khachhang.diachi,
                    sodienthoai: body.khachhang.sodienthoai,
                    ngaytao: localDate(new Date()),
                })
                .then((res) => {
                    return res.dataValues.id;
                });

            // update thu cung
            const petId = await giasuc
                .create({
                    ten: res.thucung.ten,
                    trongluong: res.thucung.trongluong,
                    dacdiem: res.thucung.dacdiem,
                    tuoi: res.thucung.tuoi,
                    gioitinh: res.thucung.gioitinh,
                    chungloai_id: res.thucung.chungloai.id !== 0 ? res.thucung.chungloai.id : null,
                    giong_id: res.thucung.giong.id === 0 ? null : res.thucung.giong.id,
                    khachhang_id: customerId,
                    ngaytao: localDate(new Date()),
                })
                .then((res) => {
                    return res.dataValues.id;
                });
            res.thucung.id = petId;
            res.khachhang.id = customerId;

            const healthFormId = await create_phieudieutri(res);
            await create_phieudieutri_sanpham(healthFormId, res.dsSP);
            await create_phieudieutri_congdichvu(healthFormId, res.dsCDV);
        } catch (error) {
            throw error;
        }
    },
};

async function create_phieudieutri(body) {
    return await phieudieutri
        .create({
            sophieudieutri: body.sophieudieutri,
            dataikham: body.taikham ? 1 : null,
            trieuchung: body.trieuchung ? body.trieuchung.trim() : '',
            chandoan: body.chandoan,
            tiensubenh: body.tiensubenh,
            khambenh: body.khambenh,
            typedieutri_id: body.typeDieuTriID,
            ghichu: body.ghichu,
            thanhtien: body.thanhtien,
            ngaytaikham: body.ngaytaikham,
            khachhang_id: body.khachhang.id,
            giasuc_id: body.thucung.id,
            bacsi_id: body.bacsiID,
            noidung: JSON.stringify(body),
            ngaytao: body.ngaykham,
            payment_id: body.paymentId,
            discountAmount: toNumber(body.discountAmount) || 0,
            addedDiscountAmount: toNumber(body.addedDiscountAmount) || 0,
        })
        .then((res) => {
            return res.dataValues.id;
        });
}

async function create_phieudieutri_sanpham(healthFormId, listSP) {
    try {
        const arr = [];
        for (let index = 0; index < listSP.length; index++) {
            const element = listSP[index];
            let obj = {
                phieudieutri_id: 0,
                sanpham_id: 0,
                ngaytao: localDate(new Date()),
            };
            obj = new Object();
            obj.phieudieutri_id = healthFormId;
            obj.sanpham_id = element.id;
            obj.ngaytao = localDate(new Date());
            arr.push(obj);
        }

        await phieudieutri_sanpham.bulkCreate(arr);
    } catch (error) {
        console.log(error);
    }
}

async function create_phieudieutri_congdichvu(healthFormId, listCDV) {
    try {
        const arr = [];
        for (let index = 0; index < listCDV.length; index++) {
            const element = listCDV[index];
            let obj = {
                phieudieutri_id: 0,
                congdichvu_id: 0,
                ngaytao: localDate(new Date()),
            };
            obj = new Object();
            obj.phieudieutri_id = healthFormId;
            obj.congdichvu_id = element.id;
            obj.ngaytao = localDate(new Date());
            arr.push(obj);
        }
        await phieudieutri_congdichvu.bulkCreate(arr);
    } catch (error) {
        console.log(error);
    }
}
