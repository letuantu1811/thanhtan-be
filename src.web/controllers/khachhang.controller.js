const { Op, where } = require('sequelize');

const khachhang = require('../../database/models/khachhang');
const giasuc = require('../../database/models/giasuc');
const chungloai = require('../../database/models/chungloai');
const Nhomkhachhang = require('../../database/models/nhomkhachhang');
const Giong = require('../../database/models/giong');
const { localDate } = require('../../utils/localDate');
const phieudieutri = require('../../database/models/phieudieutri');
const sanpham = require('../../database/models/sanpham');
const { error } = require('../../utils/api.res/response');

class CustomerController {
    async create(body) {
        let res = body;
        try {
            let id = await khachhang
                .create({
                    ngaytao: localDate(new Date()),
                    ten: res.ten,
                    nguoitao_id: res.nguoitao_id,
                    trangthai: 1,
                    diachi: res.diachi,
                    sodienthoai: res.sodienthoai,
                    ghichu: res.ghichu,
                    nhomkhachhang_id: res.nhomkhachhang_id,
                })
                .then((res) => {
                    return res.dataValues.id;
                });
            if (res.thucung.length !== 0 || res.thucung.length !== '') {
                let arr = [];
                for (let index = 0; index < res.thucung.length; index++) {
                    const element = res.thucung[index];
                    let obj = {
                        ten: '',
                        tuoi: 0,
                        trongluong: 0,
                        khachhang_id: 0,
                        taikham: 0,
                        gioitinh: 0,
                        nguoitao_id: 0,
                        trangthai: 1,
                        dacdiem: '',
                        chungloai_id: 0,
                    };
                    obj = new Object();
                    obj.ten = element.ten;
                    obj.tuoi = element.tuoi;
                    obj.trongluong = element.trongluong;
                    obj.khachhang_id = id;
                    obj.taikham = element.taikham;
                    obj.gioitinh = element.gioitinh;
                    obj.nguoitao_id = element.nguoitao_id;
                    obj.trangthai = element.trangthai;
                    obj.dacdiem = element.dacdiem;
                    obj.chungloai_id = element.chungloai_id;
                    arr.push(obj);
                    await giasuc.bulkCreate(arr);
                }
            }
        } catch (error) {
            return error;
        }
    }

    async getOne(id) {
        try {
            return await khachhang.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            return error;
        }
    }

    async getOneCustomer(id) {
        try {
            return await khachhang.findOne({
                where: {
                    id: id,
                },
                raw: true,
            });
        } catch (error) {
            return error;
        }
    }

    async getOnePet(id) {
        try {
            return await giasuc.findOne({
                where: {
                    id: id,
                }
            });
        } catch (error) {
            return error;
        }
    }

    async getMany(body) {
        try {
            return await khachhang.findAll({
                distinct: true,
                group: ['sodienthoai'],
                include: [
                    {
                        model: giasuc,
                        as: 'giasuc',
                        where: {
                            trangthai: true,
                        },
                    },
                ],
                order: [['ngaytao', 'DESC']],
                limit: 500,
            });
        } catch (error) {
            return error;
        }
    }

    async getCustomers(isAdmin) {
        try {
            const customers = await khachhang
                .findAll({
                    include: [
                        {
                            model: giasuc,
                            as: 'giasuc',
                            where: {
                                trangthai: 1,
                            },
                            required: false,
                            include: {
                                model: chungloai,
                                attributes: ['id', 'ten'],
                                as: 'chungloai',
                            },
                            include: {
                                model: Giong,
                                attributes: ['id', 'ten'],
                                as: 'giong',
                                include: {
                                    attributes: ['id', 'ten'],
                                    model: chungloai,
                                },
                            },
                        },
                        {
                            model: Nhomkhachhang,
                            as: 'nhomkhachhang',
                        },
                    ],
                    order: [['ngaytao', 'DESC']],
                    where: {
                        trangthai: true,
                    },
                })
                .map((customer) => customer.toJSON());
            return customers;
        } catch (error) {
            return error;
        }
    }

    // Pagination customers
    async getCustomers_v2(pageSize, pageNum, phone, name, address, clienteles) {
        const limit = pageSize;
        const offset = (pageNum - 1) * limit;
        const phoneParam = phone ? phone : '';
        const nameParam = name ? name : '';
        const addressParam = address ? address : '';
        let clientelesParam = {};
        if (clienteles) {
            clientelesParam = {
                nhomkhachhang_id: clienteles
            }
        }
        try {
            const customers = await khachhang.findAll({
                include: [
                    {
                        model: giasuc,
                        as: 'giasuc',
                        where: {
                            trangthai: 1,
                        },
                        required: false,
                        include: {
                            model: chungloai,
                            attributes: ['id', 'ten'],
                            as: 'chungloai',
                        },
                        include: {
                            model: Giong,
                            attributes: ['id', 'ten'],
                            as: 'giong',
                            include: {
                                attributes: ['id', 'ten'],
                                model: chungloai,
                            },
                        },
                    },
                    {
                        model: Nhomkhachhang,
                        as: 'nhomkhachhang',
                    },
                ],
                order: [['ngaytao', 'DESC']],
                limit,
                offset,
                where: {
                    trangthai: true,
                    sodienthoai: { [Op.like]: `%${phoneParam}%` },
                    ten: { [Op.like]: `%${nameParam}%` },
                    diachi: { [Op.like]: `%${addressParam}%` },                         
                    ...clientelesParam
                },
            })
                .map((customer) => customer.toJSON());

            const total = await khachhang.count({
                where: {
                    trangthai: true,
                    sodienthoai: { [Op.like]: `%${phoneParam}%` },
                    ten: { [Op.like]: `%${nameParam}%` },
                    diachi: { [Op.like]: `%${addressParam}%` },                          
                    ...clientelesParam
                }
            });
    
            const totalItems = total; 
            const totalPages = Math.ceil(totalItems / pageSize);
    
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            };   
            return { customers, pagination };

        } catch (error) {
            return error;
        }
    }

    async deleteCustomer(id) {
        try {
            return await khachhang.update(
                {
                    trangthai: 0,
                },
                {
                    where: {
                        id: id,
                    },
                },
            );
        } catch (error) {
            return error;
        }
    }

    async createCustomer(body) {
        let res = body;
        try {
            return await khachhang
                .create({
                    ten: res.ten,
                    nguoitao_id: res.nguoitao_id,
                    trangthai: 1,
                    diachi: res.diachi,
                    sodienthoai: res.sodienthoai,
                    ghichu: res.ghichu,
                    nhomkhachhang_id: res.nhomkhachhang_id,
                    email: res.email,
                })
                .then((res) => {
                    return res.dataValues.id;
                });
        } catch (error) {
            throw new Error();
        }
    }

    async updateCustomer(body) {
        let res = body;
        try {
            return await khachhang
                .update(
                    {
                        ten: res.ten,
                        trangthai: 1,
                        diachi: res.diachi,
                        sodienthoai: res.sodienthoai,
                        ghichu: res.ghichu,
                        nhomkhachhang_id: res.nhomkhachhang_id,
                        email: res.email,
                    },
                    {
                        where: {
                            id: res.id,
                        },
                    },
                )
                .then((res) => {
                    return res;
                });
        } catch (error) {
            throw new Error();
        }
    }

    async createNewPet(body) {
        let res = body;
        try {
            if (res.giasuc.length !== 0 || res.giasuc.length !== '') {
                let arr = [];
                for (let index = 0; index < res.giasuc.length; index++) {
                    const element = res.giasuc[index];
                    if (element.id === 0) {
                        let obj = {
                            ten: '',
                            tuoi: 0,
                            trongluong: 0,
                            khachhang_id: 0,
                            taikham: 0,
                            gioitinh: 0,
                            nguoitao_id: 0,
                            trangthai: 1,
                            dacdiem: '',
                            giong_id: 0,
                            chungloai_id: 0,
                        };
                        obj.ten = element.ten;
                        obj.tuoi = element.tuoi;
                        obj.trongluong = element.trongluong;
                        obj.khachhang_id = res.id;
                        obj.gioitinh = element.gioitinh === 'true' ? true : false;
                        obj.nguoitao_id = element.nguoitao_id;
                        obj.trangthai = element.trangthai;
                        obj.dacdiem = element.dacdiem;
                        obj.giong_id = element.giong_id;
                        obj.chungloai_id = element.chungloai_id;
                        arr.push(obj);
                    }
                }
                // return giasuc.sequelize.transaction().then(async (t) => {
                //     return await giasuc
                //         .bulkCreate(arr, { transaction: t })
                //         .then(() => {
                //             console.log('committtttt');
                //             t.commit();
                //         })
                //         .catch((err) => {
                //             console.log('roll backkkkkk');
                //             t.rollback();
                //             throw new Error(err);
                //         });
                // });
                giasuc.bulkCreate(arr)
                .then(() => {
                    console.log('Dữ liệu đã được chèn thành công.');                  
                })
                .catch((error) => {
                    throw new Error(error);
                });   
            }
        } catch (error) {
            throw new Error();
        }
    }

    async disablePet(id) {
        try {
            return await giasuc.update(
                {
                    trangthai: 0,
                },
                {
                    where: {
                        id: id,
                    },
                },
            );
        } catch (error) {
            return error;
        }
    }

    async importCustomer(data) {
        try {
            let khachhangObj = {
                ngaytao: localDate(new Date()),
                ten: '',
                nguoitao_id: 1,
                trangthai: 1,
                diachi: '',
                sodienthoai: '',
                ghichu: '',
                nhomkhachhang_id: 3,
                ngaytao: '',
                ngaysua: '',
            };

            let list = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                khachhangObj = new Object();
                khachhangObj.ten = element.TenChu;
                khachhangObj.nguoitao_id = 1;
                khachhangObj.nhomkhachhang_id = 1;
                khachhangObj.diachi = element.DiaChi;
                khachhangObj.sodienthoai = element.DienThoai;
                khachhangObj.trangthai = 1;
                khachhangObj.ngaytao = element.NgayPhatSinh;
                khachhangObj.ngaysua = element.NgaySuaDoi;
                list.push(khachhangObj);
            }
            return khachhang.sequelize.transaction().then(async (t) => {
                return await khachhang
                    .bulkCreate(list, { transaction: t })
                    .then(() => {
                        t.commit();
                    })
                    .catch((err) => {
                        console.log(err);
                        t.rollback();
                        throw new Error(err);
                    });
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    async importPet(data) {
        try {
            let thucungObj = {
                ten: '',
                tuoi: 0,
                trongluong: 0,
                khachhang_id: 0,
                taikham: 0,
                gioitinh: 0,
                nguoitao_id: 0,
                trangthai: 1,
                dacdiem: '',
                giong_id: 76,
                ngaysua: '',
                trangthai: 1,
                phieudieutriid: '',
            };
            let list = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let khID = 7570;
                let giong = 76;
                let kh = await khachhang.findOne({
                    where: {
                        sodienthoai: element.DienThoai,
                    },
                });
                if (element.Giong !== null) {
                    let gi = await Giong.findOne({
                        where: {
                            ten: element.Giong.TenGiong,
                        },
                    });
                    if (gi) {
                        if (gi.dataValues) {
                            if (gi.dataValues.id) giong = gi.dataValues.id;
                        }
                    }
                }
                if (kh) {
                    if (kh.dataValues) {
                        if (kh.dataValues.id) {
                            khID = kh.dataValues.id;
                        }
                    }
                }
                thucungObj = new Object();
                thucungObj.khachhang_id = khID;
                thucungObj.ten = element.TenGiaSuc;
                if (element.thongtin.length > 0) {
                    thucungObj.tuoi = element.thongtin[0].Tuoi;
                    thucungObj.trongluong = element.thongtin[0].TrongLuong;
                    for (let a = 0; a < element.thongtin.length; a++) {
                        let value = element.thongtin[a].PhieuDieuTriId;
                        thucungObj.phieudieutriid += ' ' + value;
                    }
                } else {
                    thucungObj.tuoi = 1;
                    thucungObj.trongluong = 1;
                    thucungObj.phieudieutriid = '';
                }
                thucungObj.gioitinh = element.GioiTinh;
                thucungObj.nguoitao_id = 1;
                thucungObj.trangthai = element.Xoa;
                thucungObj.giong_id = giong;
                thucungObj.ngaytao = element.NgayPhatSinh;
                thucungObj.ngaysua = element.NgaySuaDoi;
                list.push(thucungObj);
            }
            return giasuc.sequelize.transaction().then(async (t) => {
                await giasuc
                    .bulkCreate(list, { transaction: t })
                    .then(() => {
                        t.commit();
                    })
                    .catch((err) => {
                        console.log(err);
                        t.rollback();
                        throw new Error(err);
                    });
            });
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    async locKH() {
        try {
            let a = await khachhang.findAll({
                distinct: true,
                group: ['sodienthoai'],
                include: [
                    {
                        model: giasuc,
                        as: 'giasuc',
                    },
                ],
            });
            const arr = [];
            for (let index = 0; index < a.length; index++) {
                const element = a[index];
                if (element.dataValues.giasuc.length < 1) {
                    console.log(element.dataValues.id);
                    arr.push(element.dataValues.id);
                }
            }
        } catch (error) {
            throw new Error();
        }
    }

    async editPet(data) {
        try {
            return await giasuc.update(
                {
                    ten: data.ten,
                    tuoi: data.tuoi,
                    tiensubenh: data.tiensubenh ? JSON.stringify(data.tiensubenh) : ''
                },
                {
                    where: {
                        id: data.id,
                    },
                },
            );
        } catch (error) {
            return error;
        }
    }

    async gopHoSo(id, idGop) {
        try {
            await phieudieutri.update(
                { 
                    khachhang_id: id
                },
                {
                    where: {
                        khachhang_id: idGop 
                    } 
                }
            );
    
            await giasuc.update(
                {
                    khachhang_id: id 
                },
                { 
                    where: {
                        khachhang_id: idGop
                    }
                }
            );
    
            await khachhang.update(
                { 
                    trangthai: 0 
                },
                { 
                    where: {
                     id: idGop 
                    } 
                }
            );
    
            return {
                messenger: 'Gộp hồ sơ khách hàng thành công!'
            };
        } catch (error) {
            return {
                messenger: 'Có lỗi xảy ra trong quá trình gộp hồ sơ!',
            };
        }
    }

    async getPet(pageSize, pageNum, petName ,phone, name, address) {
        const petN = petName || '';
        const phoneParam = phone || '';
        const nameParam = name || '';
        const addressParam = address || '';
        
        try {
            const offset = (pageNum - 1) * pageSize;
    
            const petResult = await giasuc.findAll({
                include: [{
                    model: khachhang,
                    attributes: ['id', 'ten', 'sodienthoai', 'diachi'],
                    as: 'khachhang',
                    where: {
                        sodienthoai: { [Op.like]: `%${phoneParam}%` },
                        ten: { [Op.like]: `%${nameParam}%` },
                        diachi: { [Op.like]: `%${addressParam}%` },                         
                    },
                }],
                order: [['ngaytao', 'DESC']],
                where: {
                    trangthai: true,
                    ten: { [Op.like]: `%${petN}%` }
                },
                limit: pageSize,
                offset: offset 
            });

            const total = await giasuc.count({
                include: [{
                    model: khachhang,
                    as: 'khachhang',
                    where: {
                        sodienthoai: { [Op.like]: `%${phoneParam}%` },
                        ten: { [Op.like]: `%${nameParam}%` },
                        diachi: { [Op.like]: `%${addressParam}%` },                         
                    },
                }],
                where: {
                    trangthai: true,
                    ten: { [Op.like]: `%${petN}%` }                 
                }
            });
    
            const totalItems = total;
            const totalPages = Math.ceil(totalItems / pageSize);
    
            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            };
    
            return { petResult, pagination };
        } catch (error) {
            return error;
        }
    }

    async gopThuCung(id, idGop) {
        try {
            await phieudieutri.update(
                {
                    giasuc_id: id 
                },
                { 
                    where: { 
                        giasuc_id: idGop 
                    } 
                }
            );
            await giasuc.update(
                { 
                    trangthai: 0 
                },
                {
                    where: {
                        id: idGop 
                    } 
                }
            );
            result.status = 1;
            result.messenger = 'Gộp hồ sơ thú cưng thành công!';
            return result;
        } catch (error) {
            return error;
        }
    }
    
}

module.exports = new CustomerController();
