const Sequelize = require("sequelize");
const db = require("../config");

const Nhomthanhvien = db.define("nhomthanhvien", {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primarykey: true,
    //     autoIncrement: true
    // },
    ten: {
        type: Sequelize.STRING
    },
    nguoitao_id: {
        type: Sequelize.STRING
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    },
    category_id: {
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

module.exports = Nhomthanhvien;