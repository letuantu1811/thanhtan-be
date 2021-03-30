const Sequelize = require("sequelize");
const db = require("../database/config");
const sanpham = require('./sanpham');

const Banle = db.define("banle", {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primarykey: true,
    //     autoIncrement: true
    // },
    ten: {
        type: Sequelize.STRING
    },
    don_so: {
        type: Sequelize.INTEGER
    },
    nguoitao_id: {
        type: Sequelize.INTEGER
    },
    sanpham_id: {
        type: Sequelize.INTEGER
    },
    donvitinh_id: {
        type: Sequelize.INTEGER
    },
    so_luong: {
        type: Sequelize.INTEGER
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

//--------------------congdichvu------------
Banle.belongsToMany(sanpham, {
    through: "banle_sanpham",
    foreignKey: "banle_id"
});
sanpham.belongsToMany(Banle, {
    through: "banle_sanpham",
    foreignKey: "sanpham_id"
});

module.exports = Banle;