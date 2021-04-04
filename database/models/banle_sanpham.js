const Sequelize = require("sequelize");
const db = require("../config");

const BL_SP = db.define("banle_sanpham", {
    sanpham_id: {
        type: Sequelize.INTEGER
    },
    banle_id: {
        type: Sequelize.INTEGER
    },
    soluong: {
        type: Sequelize.INTEGER
    },
    dongiaban: {
        type: Sequelize.INTEGER
    },
    ngaytao: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = BL_SP;