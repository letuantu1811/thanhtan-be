const Sequelize = require("sequelize");
const db = require("../config");
const phieudieutri_congdichvu = require("../models/phieudieutri_congdichvu");
const phieudieutri_sanpham = require("../models/phieudieutri_sanpham");
const congdichvu = require("../models/congdichvu");
const Sanpham = require("../models/sanpham");
const sanpham = require("../models/sanpham");
const bacsi = require("../models/bacsi");
const giasuc = require("./giasuc");

const phieudieutri = db.define("phieudieutri", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nguoitao_id: {
        type: Sequelize.INTEGER
    },
    khachhang_id: {
        type: Sequelize.INTEGER
    },
    bacsi_id: {
        type: Sequelize.INTEGER
    },
    trangthai: {
        type: Sequelize.BOOLEAN
    },
    giasuc_id: {
        type: Sequelize.INTEGER
    },
    trieuchung: {
        type: Sequelize.STRING
    },
    chandoan: {
        type: Sequelize.STRING
    },
    ghichu: {
        type: Sequelize.STRING
    },
    ngaytaikham: {
        type: Sequelize.DATE
    },
    dataikham: {
        type: Sequelize.BOOLEAN
    },
    ngaytao: {
        type: Sequelize.DATE
    },
    ngaysua: {
        type: Sequelize.DATE
    },
    thanhtien: {
        type: Sequelize.DECIMAL
    },
    noidung: {
        type: Sequelize.TEXT
    },
    mapping_id: {
        type: Sequelize.TEXT
    },
    sophieudieutri: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false,
    freezeTableName: true
});
//--------------------congdichvu------------
phieudieutri.belongsToMany(congdichvu, {
    through: "phieudieutri_congdichvu",
    foreignKey: "phieudieutri_id"
});
congdichvu.belongsToMany(phieudieutri, {
    through: "phieudieutri_congdichvu",
    foreignKey: "congdichvu_id"
});
//--------------------sanpham---------------
phieudieutri.belongsToMany(sanpham, {
    through: "phieudieutri_sanpham",
    foreignKey: "phieudieutri_id"
});
sanpham.belongsToMany(phieudieutri, {
    through: "phieudieutri_sanpham",
    foreignKey: "sanpham_id"
});

bacsi.hasMany(phieudieutri, {
    foreignKey: "bacsi_id",
    as: 'bacsi'
});
phieudieutri.belongsTo(bacsi, {
    foreignKey: "bacsi_id",
    as: 'bacsi'
});
giasuc.hasMany(phieudieutri, {
    foreignKey: "giasuc_id"
});
phieudieutri.belongsTo(giasuc, {
    foreignKey: "giasuc_id"
});
module.exports = phieudieutri;