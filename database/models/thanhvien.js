const Sequelize = require("sequelize");
const db = require("../config");
const Banle = require("./banle");
const khachhang = require("./khachhang");

const Thanhvien = db.define("thanhvien", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tendangnhap: {
        type: Sequelize.STRING
    },
    matkhau: {
        type: Sequelize.STRING
    },
    quyen: {
        type: Sequelize.STRING
    },
    nguoitao_id: {
        type: Sequelize.STRING
    },
    nhomthanhvien_id: {
        type: Sequelize.INTEGER
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    },
    email: {
        type: Sequelize.STRING
    },
    ngaytao: {
        type: Sequelize.DATE
    },
    ngaysua: {
        type: Sequelize.DATE
    },
    config: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Thanhvien.hasMany(Thanhvien, {
    foreignKey: "nguoitao_id",
    as: 'nguoiban'
});
Banle.belongsTo(Thanhvien, {
    foreignKey: "nguoitao_id",
    as: 'nguoiban'
});

module.exports = Thanhvien;