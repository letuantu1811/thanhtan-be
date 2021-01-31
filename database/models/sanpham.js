const Sequelize = require("sequelize");
const db = require("../config");
const sanpham = db.define("sanpham", {
    ten: {
        type: Sequelize.STRING
    },
    nguoitao_id: {
        type: Sequelize.STRING
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    },
    nhomsanpham_id: {
        type: Sequelize.INTEGER
    },
    donvitinh_id: {
        type: Sequelize.INTEGER
    },
    gia: {
        type: Sequelize.DOUBLE
    },
    gianhap: {
        type: Sequelize.DOUBLE
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



module.exports = sanpham;