const Sequelize = require('sequelize');
const db = require('../config');

const BL_SP = db.define(
    'banle_sanpham',
    {
        sanpham_id: {
            type: Sequelize.INTEGER,
        },
        banle_id: {
            type: Sequelize.INTEGER,
        },
        soluong: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        dongiaban: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        productPrice: {
            type: Sequelize.DECIMAL(12, 0),
            defaultValue: 0,
        },
        discountAmount: {
            type: Sequelize.DECIMAL(12, 0),
            defaultValue: 0,
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

module.exports = BL_SP;
