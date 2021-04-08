const Sequelize = require("sequelize");
const db = require("../config");
const Thanhvien = require("./thanhvien");

const Nhomthanhvien = db.define("nhomthanhvien", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
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

Nhomthanhvien.hasMany(Thanhvien, {
    foreignKey: "nhomthanhvien_id",
    as: 'nhomthanhvien'
});
Thanhvien.belongsTo(Nhomthanhvien, {
    foreignKey: "nhomthanhvien_id",
    as: 'nhomthanhvien'
});

module.exports = Nhomthanhvien;