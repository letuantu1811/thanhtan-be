const { omit } = require('lodash');
const giasuc = require('../../database/models/giasuc');

exports.createPet = async (body) => {
    try {
        const newPet = {
            ten: body.ten,
            trongluong: body.trongluong,
            dacdiem: body.dacdiem,
            tuoi: body.tuoi,
            gioitinh: body.gioitinh,
            chungloai_id: body.chungloai.id || null,
            giong_id: body.giong.id || null,
            khachhang_id: body.khachhang.id,
            ngaytao: new Date(),
        };

        const dataReponse = await giasuc.create(newPet);
        return dataReponse;
    } catch (error) {
        throw new Error(error);
    }
};

exports.updatePet = async (body) => {
    try {
        const id = body.id || null;
        if (!id) {
            throw new Error('Id không được trống !');
        }

        const petAsEntity = await giasuc.findOne({
            where: {
                id: body.id,
            },
            attributes: ['id'],
            raw: true,
        });

        if (!petAsEntity) {
            throw new Error('Thú cưng không tồn tại!');
        }

        const petUpdateModel = {
            ten: body.ten,
            trongluong: body.trongluong,
            dacdiem: body.dacdiem,
            tuoi: body.tuoi,
            gioitinh: body.gioitinh,
            chungloai_id: body.chungloai.id || null,
            giong_id: body.giong.id || null,
            ngaysua: new Date(),
        };

        const options = {
            where: {
                id: body.id,
            },
        };

        const updatedPet = await giasuc.update(omit(petUpdateModel, ['id']), options);
        if (!updatedPet) {
            throw new Error('Cập nhật thú cưng không thành công!');
        }
        return updatedPet;
    } catch (error) {
        throw new Error(error.message);
    }
};
