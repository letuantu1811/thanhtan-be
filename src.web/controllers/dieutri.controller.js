const model = require('../../database/models/phieudieutri');
const { ENUM } = require('../../utils/index');
const dtServices = require('../services/dieutri.services');
const { tzSaiGon } = require('../../utils/saigontz');
const moment = require("moment");
const sequelize = require("sequelize");

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
            let status = "";
            if (res.khachhang.id !== 0 && res.thucung.id !== 0) {
                // tồn tại khách hàng và tồn tại pet
                status = "existed";
            }
            if (res.khachhang.id !== 0 && res.thucung.id === 0) {
                // tồng tại khách hàng mà không tồn tại pet
                status = "already";
            }
            if (res.khachhang.id === 0 && res.thucung.id === 0) {
                // khách hàng mới
                status = "new";
            }
            console.log(status);
            switch (status) {
                case "existed":
                    await dtServices.existed(res);
                    break;
                case "already":
                    await dtServices.already(res);
                    break;
                case "new":
                    await dtServices.new(res);
                    break;
                default:
                    break;
            }
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
    getAllToday: async() => {
        try {

            let today = tzSaiGon();
            console.log(today);
            return await model.findAll({
                where: sequelize.where(sequelize.fn('date', sequelize.col('ngaytao')), '=', today)
            });
        } catch (error) {
            return error
        }
    },
    getReExamToday: async() => {
        try {
            let today = tzSaiGon();
            console.log(today);
            return await model.findAll({
                where: {
                    where: sequelize.where(sequelize.fn('date', sequelize.col('ngaytaikham')), '=', today)
                }
            });
        } catch (error) {
            return error
        }
    }
}