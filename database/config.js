const Sequelize = require('sequelize');
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
module.exports = new Sequelize('tha81756_qlthuy', 'tha81756_qlthuy', 'xqHIjeDP&9K8hVHL', {
    host: '112.78.2.88',
    // host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: true,
    pool: {
    max: 50,       // Tăng từ 5 lên 50 (thoải mái chạy song song vì server chịu được 500)
    min: 2,        // Giữ tối thiểu 2 kết nối luôn mở để giảm độ trễ (latency)
    acquire: 60000, // Cho phép đợi tối đa 60 giây để lấy kết nối trước khi báo lỗi timeout
    idle: 10000,   // Đóng bớt kết nối thừa nếu sau 10 giây không có request nào dùng đến
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