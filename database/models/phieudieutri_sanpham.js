const Sequelize = require('sequelize');
const db = require('../config');

const PDT_SP = db.define(
    'phieudieutri_sanpham',
    {
        sanpham_id: {
            type: Sequelize.INTEGER,
        },
        phieudieutri_id: {
            type: Sequelize.INTEGER,
        },
        gia: {
            type: Sequelize.DOUBLE,
        },
        soluongban: {
            type: Sequelize.DOUBLE,
        },
        ngaytao: {
            type: Sequelize.DATE,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    },
);

module.exports = PDT_SP;
