const sanpham = require('./sanpham.route')
const nhomsanpham = require('./nhomsanpham.route')
const khachhang = require('./khachhang.route')
const dangnhap = require('./dangnhap.route')
const dieutri = require('./dieutri.route')
const donvitinh = require('./donvitinh.route')
const congdichvu = require('./congdichvu.route')
const bacsi = require('./bacsi.route')

let initClientAPI = (app, url) => {
    // insert routers ADMIN here
    app.use(url + "products", sanpham);
    app.use(url + "categories", nhomsanpham);
    app.use(url + "customers", khachhang);
    app.use(url + "users", dangnhap);
    app.use(url + "examination", dieutri);
    app.use(url + "units", donvitinh);
    app.use(url + "serviceplus", congdichvu);
    app.use(url + "doctors", bacsi);
}

module.exports = initClientAPI;