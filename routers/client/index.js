const sanpham = require('./sanpham.route')
const nhomsanpham = require('./nhomsanpham.route')
const khachhang = require('./khachhang.route')
const dangnhap = require('./dangnhap.route')
const dieutri = require('./dieutri.route')
const donvitinh = require('./donvitinh.route')
const congdichvu = require('./congdichvu.route')
const bacsi = require('./bacsi.route')
const chungloai = require('./chungloai.route')
const nhomkhachhang = require('./nhomkhachhang.route')
const banle = require('./banle.route')
const thanhvien = require('./thanhvien.route')
const setting = require('./setting.route')

let initClientAPI = (app, url) => {
    // insert routers ADMIN here
    app.use(url + "products", sanpham);
    app.use(url + "categories", nhomsanpham);
    app.use(url + "customers", khachhang);
    app.use(url + "auth", dangnhap);
    app.use(url + "examination", dieutri);
    app.use(url + "units", donvitinh);
    app.use(url + "serviceplus", congdichvu);
    app.use(url + "doctors", bacsi);
    app.use(url + "species", chungloai);
    app.use(url + "audience", nhomkhachhang);
    app.use(url + "orders", banle);
    app.use(url + "staffs", thanhvien);
    app.use(url + "config", setting);
}

module.exports = initClientAPI;