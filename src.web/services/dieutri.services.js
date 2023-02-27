const { toNumber } = require('lodash');

const khachhang = require('./../../database/models/khachhang');
const phieudieutri_congdichvu = require('./../../database/models/phieudieutri_congdichvu');
const phieudieutri_sanpham = require('./../../database/models/phieudieutri_sanpham');
const phieudieutri = require('./../../database/models/phieudieutri');

const { localDate } = require('../../utils/localDate');
const { updatePet, createPet } = require('./PetService');

module.exports = {
    existed: async(body) => {
        let res = body;
        let pdtID = await createExamForm(res);
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
        await updatePet(res.thucung);
        await create_phieudieutri_sanpham(pdtID, res.dsSP)
        await create_phieudieutri_congdichvu(pdtID, res.dsCDV)
    },

    already: async(body) => {
        try {
            // update khach hang
            await khachhang.update({
                ten: body.khachhang.ten,
                diachi: body.khachhang.diachi,
                sodienthoai: body.khachhang.sodienthoai
            }, {
                where: {
                    id: body.khachhang.id
                }
            }).then(res => {
                console.log(res + " update khach hang at taohoso");
            });

            //update thu cung
            const petId = await updatePet(body.thucung);
            body.thucung.id = petId;
            console.log(body);
            let pdtID = await createExamForm(body);



            await create_phieudieutri_sanpham(pdtID, body.dsSP).then(async (res) => {
                console.log(res + ' tại create_phieudieutri_sanpham');
            });
            await create_phieudieutri_congdichvu(pdtID, body.dsCDV).then((res) => {
                console.log(res + ' tại create_phieudieutri_congdichvu ');
            });
        } catch (error) {
            log.error(error)
            throw new Error()
        }
    },

    new: async(body) => {
        // update khach hang
        const customerId = await khachhang.create({
            ten: body.khachhang.ten,
            diachi: body.khachhang.diachi,
            sodienthoai: body.khachhang.sodienthoai,
            ngaytao: localDate(new Date())
        }).then(res => {
            console.log(res + " create khach hang at taohoso");
            return res.dataValues.id;
        });
        //update thu cung
        const petId = await createPet(body.thucung);
        body.thucung.id = petId;
        body.khachhang.id = customerId;

        const examFormCreated = await createExamForm(body);
        const examFormId = examFormCreated.get().id;

        await Promise.all(
            create_phieudieutri_sanpham(examFormId, body.dsSP),
            create_phieudieutri_congdichvu(examFormId, body.dsCDV),
        );
    },
};

async function createExamForm(body) {
    const newExamForm = {
        sophieudieutri: body.sophieudieutri,
        dataikham: body.taikham || null,
        trieuchung: body.trieuchung ? body.trieuchung.trim() : '',
        chandoan: body.chandoan,
        ghichu: body.ghichu,
        thanhtien: body.thanhtien,
        ngaytaikham: body.ngaytaikham,
        khachhang_id: body.khachhang.id,
        giasuc_id: body.thucung.id,
        bacsi_id: body.bacsiID,
        noidung: JSON.stringify(body),
        ngaytao: body.ngaykham,
        discountAmount: toNumber(body.discountAmount) || 0,
        addedDiscountAmount: toNumber(body.addedDiscountAmount) || 0,
    };
    const examFormCreated = await phieudieutri.create(newExamForm);

    if (!examFormCreated) {
        throw new Error('Tạo phiếu điều trị không thành công.');
    }

    return examFormCreated;
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