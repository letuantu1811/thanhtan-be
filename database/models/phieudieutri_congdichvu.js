const Sequelize = require("sequelize");
const db = require("../config");

const PDT_CDV = db.define("phieudieutri_congdichvu", {
    // id: {
    //     type: Sequelize.INTEGER,
    //     primarykey: true,
    //     autoIncrement: true
    // },
    congdichvu_id: {
        type: Sequelize.INTEGER
    },
    phieudieutri_id: {
        type: Sequelize.INTEGER
    },
    gia: {
        type: Sequelize.STRING
    },
    ngaytao: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = PDT_CDV;