const Sequelize = require("sequelize");
const db = require("../config");

const Donvitinh = db.define("donvitinh", {
    ten: {
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

module.exports = Donvitinh;