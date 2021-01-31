const sanpham = require('./sanpham.route')
const nhomsanpham = require('./nhomsanpham.route')
const khachhang = require('./khachhang.route')
    // const thanhvien = require('./thanhvien.route')
const dangnhap = require('./dangnhap.route')
const dieutri = require('./dieutri.route')

let initClientAPI = (app, url) => {
    // insert routers ADMIN here
    app.use(url + "products", sanpham);
    app.use(url + "categories", nhomsanpham);
    app.use(url + "customers", khachhang);
    app.use(url + "users", dangnhap);
    app.use(url + "examination", dieutri);
}

module.exports = initClientAPI;