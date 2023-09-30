const Sequelize = require('sequelize');
const nhomsanpham = require('./nhomsanpham');
const donvitinh = require('./donvitinh');
const db = require('../config');

const sanpham = db.define(
    'sanpham',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ten: {
            type: Sequelize.STRING,
        },
        tenthaythe: {
            type: Sequelize.STRING,
        },
        nhacungcap: {
            type: Sequelize.STRING,
        },
        nguoitao_id: {
            type: Sequelize.STRING,
        },
        trangthai: {
            type: Sequelize.BOOLEAN,
        },
        nhomsanpham_id: {
            type: Sequelize.INTEGER,
        },
        donvitinh_id: {
            type: Sequelize.INTEGER,
        },
        donviquydoi_id: {
            type: Sequelize.INTEGER,
        },
        giatriquydoi: {
            type: Sequelize.INTEGER,
        },
        gia: {
            type: Sequelize.DOUBLE,
        },
        gianhap: {
            type: Sequelize.DOUBLE,
        },
        soluong: {
            type: Sequelize.INTEGER,
        },
        soluongconlai: {
            type: Sequelize.INTEGER,
        },
        soluongquydoiton: {
            type: Sequelize.INTEGER,
        },
        soluongtoithieu: {
            type: Sequelize.INTEGER,
        },
        ngaytao: {
            type: Sequelize.DATE,
        },
        ngaysua: {
            type: Sequelize.DATE,
        },
        an: {
            type: Sequelize.BOOLEAN,
        },
        mavach: {
            type: Sequelize.STRING,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    },
);

nhomsanpham.hasMany(sanpham, {
    foreignKey: 'nhomsanpham_id',
});
sanpham.belongsTo(nhomsanpham, {
    foreignKey: 'nhomsanpham_id',
});
donvitinh.hasMany(sanpham, {
    foreignKey: 'donvitinh_id',
    as: 'donvitinh',
});
sanpham.belongsTo(donvitinh, {
    foreignKey: 'donvitinh_id',
    as: 'donvitinh',
});
donvitinh.hasMany(sanpham, {
    foreignKey: 'donviquydoi_id',
    as: 'donviquydoi',
});
sanpham.belongsTo(donvitinh, {
    foreignKey: 'donviquydoi_id',
    as: 'donviquydoi',
});

module.exports = sanpham;
