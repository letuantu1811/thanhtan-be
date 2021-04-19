const Sequelize = require("sequelize");
const db = require("../config");
const chungloai = require("../models/chungloai");
const Giong = require("./giong");

const giasuc = db.define("giasuc", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: Sequelize.STRING
    },
    khachhang_id: {
        type: Sequelize.INTEGER
    },
    tuoi: {
        type: Sequelize.INTEGER
    },
    trongluong: {
        type: Sequelize.INTEGER
    },
    taikham: {
        type: Sequelize.BOOLEAN
    },
    gioitinh: {
        type: Sequelize.BOOLEAN
    },
    nguoitao_id: {
        type: Sequelize.STRING
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    },
    dacdiem: {
        type: Sequelize.STRING
    },
    giong_id: {
        type: Sequelize.INTEGER
    },
    chungloai_id: {
        type: Sequelize.INTEGER
    },
    ngaytao: {
        type: Sequelize.DATE
    },
    ngaysua: {
        type: Sequelize.DATE
    },
    phieudieutriid: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true
});
chungloai.hasMany(giasuc, {
    foreignKey: "chungloai_id",
    as: 'chungloai'
});
giasuc.belongsTo(chungloai, {
    foreignKey: "chungloai_id",
    as: 'chungloai'
});

Giong.hasMany(giasuc, {
    foreignKey: "giong_id",
    as: 'giong'
});
giasuc.belongsTo(Giong, {
    foreignKey: "giong_id",
    as: 'giong'
});

module.exports = giasuc;