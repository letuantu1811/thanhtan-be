const Sequelize = require("sequelize");
const db = require("../config");

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
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Thanhvien;