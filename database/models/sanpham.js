const Sequelize = require("sequelize");
const nhomsanpham = require('./nhomsanpham');
const donvitinh = require('./donvitinh');
const db = require("../config");
const sanpham = db.define("sanpham", {
    ten: {
        type: Sequelize.STRING
    },
    tenthaythe: {
        type: Sequelize.STRING
    },
    nhacungcap: {
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
    soluong: {
        type: Sequelize.INTEGER
    },
    soluongtoithieu: {
        type: Sequelize.INTEGER
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
nhomsanpham.hasMany(sanpham, {
    foreignKey: "nhomsanpham_id"
});
sanpham.belongsTo(nhomsanpham, {
    foreignKey: "nhomsanpham_id"
});
donvitinh.hasMany(sanpham, {
    foreignKey: "donvitinh_id"
});
sanpham.belongsTo(donvitinh, {
    foreignKey: "donvitinh_id"
});



module.exports = sanpham;
