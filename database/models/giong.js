const Sequelize = require("sequelize");
const db = require("../config");
const Chungloai = require("./chungloai");

const Giong = db.define("giong", {
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
Chungloai.hasMany(Giong, {
    foreignKey: "chungloai_id"
});
Giong.belongsTo(Chungloai, {
    foreignKey: "chungloai_id"
});
module.exports = Giong;