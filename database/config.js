const Sequelize = require("sequelize");
module.exports = new Sequelize('qlthuy', 'manager', 'Zaq@123456', {
    host: '34.126.105.244',
    // host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    timestamps: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
// module.exports = new Sequelize('qlthuy', 'root', '12wqasxZ', {
//     host: 'localhost',
//     // host: 'localhost',
//     dialect: 'mysql',
//     port: 3306,
//     logging: false,
//     timestamps: false,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });