const model = require("../../database/models/phieudieutri");
const { ENUM } = require("../../utils/index");
const dtServices = require("../services/dieutri.services");
const { tzSaiGon } = require("../../utils/saigontz");
const moment = require("moment");
const sequelize = require("sequelize");
const Thanhvien = require("../../database/models/thanhvien");
const { localDate } = require("../../utils/localDate");
const giasuc = require("../../database/models/giasuc");
const phieudieutri = require("../../database/models/phieudieutri");
const phieudieutri_congdichvu = require("../../database/models/phieudieutri_congdichvu");
const khachhang = require("../../database/models/khachhang");
const Congdichvu = require("../../database/models/congdichvu");
const sanpham = require("../../database/models/sanpham");
const { Op, where } = require("sequelize");
const Giong = require("../../database/models/giong");
const Chungloai = require("../../database/models/chungloai");
const { toNumber } = require("lodash");

module.exports = {
    create: async(res) => {
        console.log(model);
        try {
            return await model.create({
                ngaytao: localDate(new Date()),
                khachhang_id: res.guest_id,
                nguoitao_id: res.user_id,
                trieuchung: res.description,
                ghichu: res.note,
                ngaytaikham: res.re_examination,
                dataikham: res.status_examination,
                congdichvu: res.service_plus,
                thanhtien: res.total,
                discountAmount: toNumber(res.discountAmount) || 0,
                addedDiscountAmount: toNumber(res.addedDiscountAmount) || 0,
            });
        } catch (error) {
            return error;
        }
    },

    createHoSo: async(res, userId) => {
        try {
            if (res.id !== "") {
                await updateTK(res.id);
            }
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
            switch (status) {
                case "existed":
                    await dtServices.existed(res, userId);
                    break;
                case "already":
                    await dtServices.already(res, userId);
                    break;
                case "new":
                    await dtServices.new(res, userId);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },




    // get one model
    getOne: async(id) => {
        try {
      const rawExamForm = await model.findOne({
        include: [
          { model: giasuc, as: "giasuc" },
          { model: khachhang, as: "khachhang" },
        ],
        where: {
          id: id,
        },
      });

      const examForm = rawExamForm.toJSON();

      const discountAmount = toNumber(examForm.discountAmount) || 0;
      const addedDiscountAmount = toNumber(examForm.addedDiscountAmount) || 0;
      const thanhtien = toNumber(examForm.thanhtien) || 0;

      const orginTotalAmount =
        (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);

      const reCalculateAmountExamForm = { ...examForm, thanhtien: orginTotalAmount };
      return reCalculateAmountExamForm

        } catch (error) {
            return error;
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
                    state: quyen == "admin" ? "" : ENUM.ENABLE,
                },
                order: [
                    ["ngaytao", "DESC"]
                ],
                offset: offset,
                limit: limit,
            });
        } catch (error) {
            return error;
        }
    },

    // disable model
    disable: async(id) => {
        try {
            return await model.update({
                state: ENUM.DISABLE,
            }, {
                where: {
                    id: id,
                },
            });
        } catch (error) {
            return error;
        }
    },

    // disable model
    getAllToday: async(date) => {
        try {
            let today = date ? date : tzSaiGon();
      // if
      const currentDateTreetments = await model.findAll({
        include: [
          { model: giasuc, as: "giasuc" },
          { model: khachhang, as: "khachhang" },
        ],
                where: {
                    where: sequelize.where(
                        sequelize.fn("date", sequelize.col("phieudieutri.ngaytao")),
                        "=",
                        today
                    ),
                    trangthai: 1,
                },
                order: [
                    ["ngaytao", "DESC"]
                ],
            });
      return currentDateTreetments.map((treetMent) => {
        const rawTreetMent = treetMent.toJSON();
        console.log("🚀 ~ file: dieutri.controller.js:172 ~ returncurrentDateTreetments.map ~ rawTreetMent:", rawTreetMent)
        const discountAmount = toNumber(rawTreetMent.discountAmount) || 0;
        const addedDiscountAmount =
          toNumber(rawTreetMent.addedDiscountAmount) || 0;
        const thanhtien = toNumber(rawTreetMent.thanhtien) || 0;

        const orginTotalAmount =
          (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);

        const reCalculateAmountExamForm = {
          ...rawTreetMent,
          discountAmount: 0,
          addedDiscountAmount: 0,
          thanhtien: orginTotalAmount,
        };
        return reCalculateAmountExamForm;
      });
        } catch (error) {
            return error;
        }
    },

    getAll: async(role) => {
        let obj = {
            limit: null,
        };
        if (role.toUpperCase() === "USER") {
            let config = await Thanhvien.findOne({
                attributes: ["config"],
                where: { id: 1 },
            });
            obj.limit = config.config;
        }
        try {
            let today = tzSaiGon();
            return await model.findAll({
                include: [{
                    model: giasuc,
                }, ],
                ...obj,
                where: {
                    trangthai: 1,
                },
                order: [
                    ["ngaytao", "DESC"]
                ],
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    getReExamByDate: async(date) => {
        try {
            const selectedDate = date ? date : tzSaiGon();
            const treetments = await model.findAll({
        include: [
            { model: giasuc, as: "giasuc" },
            { model: khachhang, as: "khachhang" },
          ],
        where: {
          where: sequelize.where(
            sequelize.fn("date", sequelize.col("ngaytaikham")),
            "=",
            selectedDate
          ),
          trangthai: 1,
        },
                order: [
                    ["ngaytao", "DESC"]
                ],
            });

            return treetments.map((treetMent) => {
              const rawTreetMent = treetMent.toJSON();
              const discountAmount = toNumber(rawTreetMent.discountAmount) || 0;
              const addedDiscountAmount =
                toNumber(rawTreetMent.addedDiscountAmount) || 0;
              const thanhtien = toNumber(rawTreetMent.thanhtien) || 0;
      
              const orginTotalAmount =
                (thanhtien + discountAmount) / (1 - addedDiscountAmount / 100);
      
              const reCalculateAmountExamForm = {
                ...rawTreetMent,
                discountAmount: 0,
                addedDiscountAmount: 0,
                thanhtien: orginTotalAmount,
              };
              return reCalculateAmountExamForm;
            });
        } catch (error) {
            return error;
        }
    },

    getNotification: async(role) => {
        try {
            let today = tzSaiGon();
            console.log(today);
            let reExamCount = await model.count({
                where: {
                    where: sequelize.where(
                        sequelize.fn("date", sequelize.col("ngaytaikham")),
                        "=",
                        today
                    ),
                    // dataikham: null,
                },
            });
            let examTodayCount = await model.count({
                where: {
                    where: sequelize.where(
                        sequelize.fn("date", sequelize.col("ngaytao")),
                        "=",
                        today
                    ),
                    trangthai: 1,
                },
            });
            if (role === 'USER') {
                return body = {
                    countDTtoday: 0,
                    countTDTtody: 0,
                };
            } else
                return body = {
                    countDTtoday: examTodayCount,
                    countTDTtody: reExamCount,
                };
            // return body;
        } catch (error) {
            return error;
        }
    },

    importEXAM: async(res) => {
        console.log(model);
        try {
            let arr = [];
            let obj = {
                mapping_id: "",
                khachhang_id: 0,
                nguoitao_id: 0,
                ngaytao: "",
                ngaysua: "",
                trangthai: 1,
                trieuchung: "",
                ghichu: "",
                ngaytaikham: 1,
                dataikham: 0,
                tylegiamgia: 0,
                thanhtien: 0,
                giasuc_id: 1,
                noidung: "",
                bacsi_id: 1,
                chandoan: "",
            };
            for (let index = 0; index < res.length; index++) {
                const item = res[index];
                let kh = await khachhang.findOne({
                    where: {
                        sodienthoai: item.thongtin.DienThoai,
                    },
                });
                let name = {};
                if (kh) {
                    // let name = await giasuc.findOne({ where: { ten: item.thongtin.TenGiaSuc, khachhang_id: kh.dataValues.id } });
                    name = await giasuc.findOne({
                        where: {
                            ten: item.thongtin.TenGiaSuc,
                            khachhang_id: kh.dataValues.id,
                        },
                    });
                } else {
                    name = await giasuc.findOne({
                        where: { ten: item.thongtin.TenGiaSuc },
                    });
                }
                // console.log(name);
                if (name !== null) {
                    obj = new Object();
                    obj.khachhang_id = name.dataValues.id;
                    obj.nguoitao_id = 1;
                    obj.ngaytao = item.NgayPhatSinh;
                    obj.ngaysua = item.NgaySuaDoi;
                    obj.trangthai = item.Xoa ? 0 : 1;
                    obj.trieuchung = item.TrieuChung;
                    obj.chandoan = item.ChanDoan;
                    obj.ghichu = item.GhiChu;
                    obj.ngaytaikham = item.NgayTaiKham;
                    obj.dataikham = item.DaTaiKham;
                    obj.tylegiamgia = item.TyLeGiamGia;
                    obj.mapping_id = item.PhieuDieuTriId;
                    arr.push(obj);
                }
            }
            await phieudieutri.bulkCreate(arr);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    importServicePlus: async(res) => {
        try {
            let obj = {
                phieudieutri_id: 0,
                congdichvu_id: 0,
                gia: 0,
                ngaytao: "",
            };
            let arr = [];
            // ``
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                let pdtID = await phieudieutri.findOne({
                    attributes: ["id"],
                    where: {
                        mapping_id: element.PhieuDieuTriId,
                    },
                });
                for (let index2 = 0; index2 < element.congdichvu.length; index2++) {
                    const cdv = element.congdichvu[index2];
                    let cdvID = await Congdichvu.findOne({
                        attributes: ["id", "gia"],
                        where: {
                            ten: cdv.TenCongDichVu,
                        },
                    });
                    obj = new Object();
                    if (cdvID !== null && pdtID !== null) {
                        obj.phieudieutri_id = pdtID.id !== null ? pdtID.id : "";
                        obj.congdichvu_id = cdvID.id !== null ? cdvID.id : "";
                        obj.ngaytao = element.NgayDieuTri;
                        obj.gia = cdvID.gia;
                        if (obj.phieudieutri_id !== "" || obj.congdichvu_id !== "")
                            arr.push(obj);
                    }
                }
            }
            if (arr.length > 0) {
                return phieudieutri_congdichvu.sequelize
                    .transaction()
                    .then(async(t) => {
                        return await phieudieutri_congdichvu
                            .bulkCreate(arr, { transaction: t })
                            .then(() => {
                                return t.commit();
                            })
                            .catch((err) => {
                                console.log(err + " tại func thêm phieudieutri_congdichv");
                                t.rollback();
                                throw Error(err);
                            });
                    });
            }
            // console.log(arr);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    importProducts: async(res) => {
        try {
            let obj = {
                phieudieutri_id: 0,
                sanpham_id: 0,
                gia: 0,
                ngaytao: "",
            };
            let arr = [];
            // ``
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                let pdtID = await phieudieutri.findOne({
                    attributes: ["id"],
                    where: {
                        mapping_id: element.PhieuDieuTriId,
                    },
                });
                for (let index2 = 0; index2 < element.sanpham.length; index2++) {
                    const cdv = element.sanpham[index2];
                    let spID = await sanpham.findOne({
                        attributes: ["id", "gia"],
                        where: {
                            ten: cdv.TenThuoc,
                        },
                    });
                    obj = new Object();
                    if (spID !== null && pdtID !== null) {
                        obj.phieudieutri_id = pdtID.id !== null ? pdtID.id : "";
                        obj.sanpham_id = spID.id !== null ? spID.id : "";
                        obj.ngaytao = element.NgayPhatSinh;
                        obj.gia = spID.gia;
                        if (obj.phieudieutri_id !== "" || obj.sanpham_id !== "")
                            arr.push(obj);
                    }
                }
            }
            if (arr.length > 0) {
                return phieudieutri_sanpham.sequelize.transaction().then(async(t) => {
                    return await phieudieutri_sanpham
                        .bulkCreate(arr, { transaction: t })
                        .then(() => {
                            return t.commit();
                        })
                        .catch((err) => {
                            console.log(err + " tại func thêm phieudieutri_sanpham");
                            t.rollback();
                            throw Error(err);
                        });
                });
            }
            // console.log(arr);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },
    getAllExamByPetId: async(id, phieudieutriid) => {
        console.log(
            '🚀 ~ file: dieutri.controller.js:494 ~ getAllExamByPetId:async ~ phieudieutriid:',
            phieudieutriid,
            typeof phieudieutriid,
            !phieudieutriid,
        );
        try {
            let arr = [];
            let obj = {};
            if (true) {
                obj = {
                    giasuc_id: id,
                };
            } else {
                arr = phieudieutriid.split(' ');
                arr = arr.filter((item) => {
                    return item !== 'undefined';
                });
                obj = {
                    mapping_id: {
                        [Op.in]: arr,
                    },
                };
            }

            return await model.findAll({
                include: [{
                        model: Congdichvu,
                    },
                    {
                        model: sanpham,
                    },
                    { model: giasuc },
                    { model: khachhang },
                ],
                where: {
                    trangthai: 1,
                    ...obj,
                },
                order: [
                    ["ngaytao", "DESC"]
                ],
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    updateHSBA: async(data) => {
        try {
            await model.update({
                noidung: JSON.stringify(data),
                trieuchung: data.trieuchung,
                chandoan: data.chandoan,
                ghichu: data.ghichu,
                ngaytao: data.ngaykham,
                ngaytaikham: data.ngaytaikham,
            }, {
                where: {
                    id: data.id,
                },
            });
        } catch (error) {
            throw new Error();
        }
    },

    updatePet: async(data) => {
        try {
            await giasuc.update({
                ten: data.ten,
                tuoi: data.tuoi,
            }, {
                where: {
                    id: data.id,
                },
            });
        } catch (error) {
            throw new Error();
        }
    },

    deletePet: async(id) => {
        try {
            await giasuc.update({
                trangthai: 0,
            }, {
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error();
        }
    },

    deleteDT: async(id) => {
        try {
            await phieudieutri.update({
                trangthai: 0,
            }, {
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error();
        }
    },

    getPetExamination: async(role) => {
        let obj = {
            limit: null,
        };
        try {
            let today = tzSaiGon();
            console.log(today);
            return await giasuc.findAll({
                include: [{
                        model: khachhang,
                        require: true,
                        as: "khachhang"
                    },
                    {
                        model: phieudieutri,
                    },
                    {
                        model: Giong,
                        as: "giong",
                        include: { model: Chungloai, as: "chungloai" }
                    }
                ],
                ...obj,
                where: {
                    trangthai: 1,
                },
                order: [
                    ["ngaytao", "DESC"]
                ],
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    },

    // get medical history 
    getPetMedicalHistory: async(id) => {
        try {
            return await model.findAll({
                attributes: ["trieuchung", "chandoan", "ghichu"],
                include: {
                    attributes: ["id"],
                    required: true,
                    model: giasuc,
                    where: {
                        id: id
                    }
                }
            });
        } catch (error) {
            return error;
        }
    },

    // get medical history 
    isExisted: async(id) => {
        try {
            let today = tzSaiGon();
            return await model.count({
                where: {
                    giasuc_id: id,
                    where: sequelize.where(
                        sequelize.fn("date", sequelize.col("ngaytao")),
                        "=",
                        today
                    )
                }
            });
        } catch (error) {
            return error;
        }
    },

    filterBlockedInExam: async(pddID) => {
        try {
            let kh = await phieudieutri.count({
                include: {
                    model: sanpham,
                    where: {
                        an: 1
                    }
                },
                where: {
                    id: pddID,
                },
            });
            return kh;
        } catch (error) {
            console.log(error);
        }
    }
};

function updateTK(id) {
    try {
        return model.update({
            dataikham: 1
        }, {
            where: {
                id: id,
            },
        });
    } catch (error) {
        return error;
    }
}