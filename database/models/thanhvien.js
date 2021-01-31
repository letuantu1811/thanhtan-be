const Sequelize = require("sequelize");
const db = require("../config");

const Thanhvien = db.define("thanhvien", {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primarykey: true,
    //     autoIncrement: true
    // },
    tendangnhap: {
        type: Sequelize.STRING
    },
    matkhau: {
        type: Sequelize.STRING
    },
    nguoitao_id: {
        type: Sequelize.STRING
    },
    trangthai: {
        type: Sequelize.BOOLEAN
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