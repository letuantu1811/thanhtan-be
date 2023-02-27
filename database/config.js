const Sequelize = require("sequelize");
// module.exports = new Sequelize('qlthuy', 'root', '12wqasxZ', {
//     // host: '34.126.105.244',
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306,
//     logging: false,
//     timezone: "+07:00",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });
module.exports = new Sequelize('tha81756_qlthuy', 'tha81756_qlthuy', 'Zaq@123456', {
    host: '103.138.88.13',
    // host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: true,
    timezone: "+07:00",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// [
//     {
//         "id": null,
//         "tenhanghoa": "123",
//         "trangthai": false,
//         "tenthaythe": "uyunm",
//         "nhacungcap": "ijh",
//         "nhomsanpham_id": "",
//         "donvitinh_id": "",
//         "soluongtoithieu": "10",
//         "gia": "123,123",
//         "soluong": 0,
//         "gianhap": "123,123",
//         "ngaytao": "",
//         "donvitinh": {
//             "id": null,
//             "ten": "Cái",
//             "trangthai": false
//         },
//         "nhomsanpham": {
//             "id": null,
//             "ten": "123",
//             "trangthai": false
//         },
//         "ten": "123",
//         "thanhtien": "3,693,690",
//         "soluongthem": "30"
//     },
// ]