const Sequelize = require('sequelize');
const db = require('../config');
const sanpham = require('./sanpham');
const banle_sanpham = require('./banle_sanpham');

const Banle = db.define(
    'banle',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        khachhang_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        nguoitao_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        ten: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        tongdonhang: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        discountAmount: {
            type: Sequelize.DECIMAL(12, 0),
            defaultValue: 0,
        },
        ghichu: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        trangthai: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
        },
        ngaytao: {
            type: Sequelize.DATE,
        },
        ngaysua: {
            type: Sequelize.DATE,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    },
);

Banle.belongsToMany(sanpham, {
    through: banle_sanpham,
    foreignKey: 'banle_id',
    as: 'sanpham',
});
sanpham.belongsToMany(Banle, {
    through: banle_sanpham,
    foreignKey: 'sanpham_id',
    as: 'sanpham',
});

module.exports = Banle;
