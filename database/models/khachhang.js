const Sequelize = require("sequelize");
const db = require("../config");
const giasuc = require("../models/giasuc");
const Banle = require("./banle");

const khachhang = db.define("khachhang", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    nhomkhachhang_id: {
        type: Sequelize.INTEGER
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

khachhang.hasMany(Banle, {
    foreignKey: "khachhang_id",
    as: 'khachhang'
});
Banle.belongsTo(khachhang, {
    foreignKey: "khachhang_id",
    as: 'khachhang'
});

module.exports = khachhang;