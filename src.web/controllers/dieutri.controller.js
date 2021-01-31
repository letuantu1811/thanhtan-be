const model = require('../../database/models/phieudieutri');
const { ENUM } = require('../../utils/index');
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

            // },
            // Updating model
            // update: async(res) => {
            //     console.log(model);
            //     try {
            //         return await model.update({
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