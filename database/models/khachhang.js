const Sequelize = require("sequelize");
const db = require("../config");
const giasuc = require("../models/giasuc");

const khachhang = db.define("khachhang", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    ten: {
        type: Sequelize.STRING
    },
    nguoitao_id: {
        type: Sequelize.STRING
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    },
    diachi: {
        type: Sequelize.STRING
    },
    sodienthoai: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    ghichu: {
        type: Sequelize.STRING
    },
    ngaytao: {
        type: Sequelize.DATE
    },
    ngaysua: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false,
    freezeTableName: true
});
khachhang.hasMany(giasuc, {
    foreignKey: "khachhang_id",
    as: 'giasuc'
});
giasuc.belongsTo(khachhang, {
    foreignKey: "khachhang_id",
    as: 'giasuc'
});

module.exports = khachhang;