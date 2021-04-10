const Sequelize = require("sequelize");
const db = require("../config");
const sanpham = require('./sanpham');
const banle_sanpham = require('./banle_sanpham');

const Banle = db.define("banle", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nguoitao_id: {
        type: Sequelize.INTEGER
    },
    ten: {
        type: Sequelize.STRING
    },
    tongdonhang: {
        type: Sequelize.INTEGER
    },
    tylegiamgia: {
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
    through: banle_sanpham,
    foreignKey: "banle_id",
    as: 'sanpham'
});
sanpham.belongsToMany(Banle, {
    through: banle_sanpham,
    foreignKey: "sanpham_id",
    as: 'sanpham'
});

module.exports = Banle;