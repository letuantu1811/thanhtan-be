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
    logging: false,
    timezone: "+07:00",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});