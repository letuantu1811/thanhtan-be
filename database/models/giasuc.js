const Sequelize = require("sequelize");
const db = require("../config");

const giasuc = db.define("giasuc", {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primarykey: true,
    //     autoIncrement: true
    // },
    ten: {
        type: Sequelize.STRING
    },
    tuoi: {
        type: Sequelize.INTEGER
    },
    trongluong: {
        type: Sequelize.INTEGER
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
    giong: {
        type: Sequelize.STRING
    },
    chungloai_id: {
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

module.exports = giasuc;