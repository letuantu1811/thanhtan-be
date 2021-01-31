const Sequelize = require("sequelize");
module.exports = new Sequelize('qlthuy2', 'root', '12wqasxZ', {
    host: 'localhost',
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