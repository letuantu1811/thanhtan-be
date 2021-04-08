const Sequelize = require("sequelize");
const db = require("../config");

const Congdichvu = db.define("congdichvu", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: Sequelize.STRING
    },
    gia: {
        type: Sequelize.STRING
    },
    nguoitao_id: {
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
module.exports = Congdichvu;