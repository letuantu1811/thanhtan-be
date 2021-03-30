const Sequelize = require("sequelize");
const db = require("../config");
const khachhang = require("./khachhang");

const Nhomkhachhang = db.define("nhomkhachhang", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: Sequelize.STRING
    },
    tylegiamgia: {
        type: Sequelize.INTEGER
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    }
}, {
    timestamps: false,
    freezeTableName: true
});
Nhomkhachhang.hasMany(khachhang, {
    foreignKey: "nhomkhachhang_id",
    as: 'nhomkhachhang'
});
khachhang.belongsTo(Nhomkhachhang, {
    foreignKey: "nhomkhachhang_id",
    as: 'nhomkhachhang'
});

module.exports = Nhomkhachhang;