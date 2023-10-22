const Order = require('../../database/models/banle');
const Product = require('../../database/models/sanpham');
const Unit = require('../../database/models/donvitinh');
const Customer = require('../../database/models/khachhang');
const User = require('../../database/models/thanhvien');
const BL_SP = require('../../database/models/banle_sanpham');
const sequelize = require('../../database/config');

const { templateBillPath } = require('../../config');
const { replaceValueHtml } = require('../../utils/template');
const { getDataTemplate } = require('../../utils/template');
const { getOneUser } = require('../controllers/thanhvien.controller');
const { toNumber, isEmpty } = require('lodash');
const { formatPrice, convertNumberToText, unMaskPrice } = require('../../utils/string');
const { getCurrentDate } = require('../../utils/formatDate');
const { ENUM, PRINT_MODE } = require('../../utils');
const { localDate } = require('../../utils/localDate');
const { BadRequestException } = require('../../utils/api.res/api.error');
const moment = require('moment');
const { Op } = require('sequelize');

class OrderService {
    async getOrderList() {
        const orderEntityList = await Order.findAll({
            include: [
                {
                    model: Product,
                    as: 'sanpham',
                    include: {
                        model: Unit,
                        as: 'donvitinh',
                        attributes: { include: ['id', 'ten'] },
                    },
                    attributes: { exclude: ['nhacungcap', 'nguoitao_id', 'trangthai'] },
                },
                {
                    model: Customer,
                    as: 'khachhang',
                },
                {
                    attributes: { include: ['id', 'tendaydu', 'quyen'] },
                    model: User,
                    as: 'nguoiban',
                },
            ],
            attributes: { exclude: ['ngaysua', 'trangthai'] },
            order: [['ngaytao', 'DESC']],
            where: {
                trangthai: ENUM.ENABLE,
            },
        });

        const rawOrderList = orderEntityList.map((orderEntity) => {
            const rawOrder = orderEntity.toJSON();
            const products = rawOrder.sanpham.map((product) => {
                const banle_sanpham = product.banle_sanpham || {};
                const convertedProduct = {
                    productPrice: toNumber(banle_sanpham.productPrice) || 0,
                    discountAmount: toNumber(banle_sanpham.discountAmount) || 0,
                };
                return {
                    ...product,
                    banle_sanpham: Object.assign(banle_sanpham, convertedProduct),
                };
            });
            return {
                ...rawOrder,
                discountAmount: toNumber(rawOrder.discountAmount) || 0,
                sanpham: products,
            };
        });

        return rawOrderList;
    }

    // list order pagination
    async getOrderList_v2(pageSize, pageNum, customerName, fromDate, toDate) {
        const customer = customerName ? customerName : '';

        let from_date = moment().startOf('day').subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss');
        let to_date = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        if (fromDate && toDate) {
            from_date = moment(parseInt(fromDate)).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            to_date = moment(parseInt(toDate)).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        const defaultIncludes = [
            {
                model: Product,
                as: 'sanpham',
                include: {
                    model: Unit,
                    as: 'donvitinh',
                    attributes: { include: ['id', 'ten'] },
                },
                attributes: { exclude: ['nhacungcap', 'nguoitao_id', 'trangthai'] },
            },
            {
                model: Customer,
                as: 'khachhang',
            },
            {
                attributes: { include: ['id', 'tendaydu', 'quyen'] },
                model: User,
                as: 'nguoiban',
            }
        ];
        try {
            const orderEntityList = await Order.findAll({
                include: [...defaultIncludes],
                attributes: { exclude: ['ngaysua', 'trangthai'] },
                order: [['ngaytao', 'DESC']],
                where: {
                    ten: { [Op.like]: `%${customer}%`},
                    trangthai: 1,
                    ngaytao: {
                        [Op.gte]: from_date,
                        [Op.lte]: to_date,
                    },
                }
            });
  
            const rawOrderList = orderEntityList.map((orderEntity) => {
                const rawOrder = orderEntity.toJSON();
                const products = rawOrder.sanpham.map((product) => {
                    const banle_sanpham = product.banle_sanpham || {};
                    const convertedProduct = {
                        productPrice: toNumber(banle_sanpham.productPrice) || 0,
                        discountAmount: toNumber(banle_sanpham.discountAmount) || 0,
                    };
                    return {
                        ...product,
                        banle_sanpham: Object.assign(banle_sanpham, convertedProduct),
                    };
                });
                return {
                    ...rawOrder,
                    discountAmount: toNumber(rawOrder.discountAmount) || 0,
                    sanpham: products,
                };
            }); 
            const totalItems = rawOrderList.length; 
            const totalPages =  Math.ceil(totalItems / pageSize);
            const start = (pageNum - 1) * pageSize;
            const end = pageSize * pageNum - 1;
            const data = rawOrderList.slice(start, end);

            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            };  
            return { data, pagination };
        } catch(error) {
            console.log(error);
            throw new Error();
        }
    }

    convertDetails(details, banleID) {
        return details.reduce((result, item) => {
            result.push({
                sanpham_id: item.id,
                banle_id: banleID,
                soluong: toNumber(item.soluong) || 1,
                dongiaban: toNumber(item.dongiaban) || 0,
                discountAmount: toNumber(item.discountAmount) || 0,
            });
            return result;
        }, []);
    }

    async createOrder(body) {
        let transaction = null;
        try {
            if (!body.listSP || !body.listSP.length) {
                throw new BadRequestException('Không có sản phẩm nào được chọn');
            }

            const date = localDate(new Date());

            transaction = await sequelize.transaction();
            await Promise.all(
                body.listSP.map(async (item) => {
                    const product = await Product.findOne({
                        where: {
                            id: item.id,
                            trangthai: ENUM.ENABLE,
                        },
                        attributes: ['id', 'soluong', 'soluongconlai'],
                    });
                    if (!product) {
                        throw new BadRequestException(`Không tìm thấy sản phẩm với id ${item.id}`);
                    }
                    if (!product.soluong) return;

                    const soluong = toNumber(product.soluong) || 0;
                    const soluongban = toNumber(item.soluong) || 0;
                    const soluongconlai = !product.soluongconlai || product.soluongconlai == 0
                    ? soluong - soluongban : product.soluongconlai - soluongban;
                    // const remainQuantity = soluong - soluongban;
                    await Product.update(
                        { soluongconlai: soluongconlai },
                        {
                            where: {
                                id: item.id,
                            },
                        },
                    );
                }),
            );

            const rowcreated = await Order.create({
                ngaytao: date,
                ten: body.ten ? body.ten.trim() : '',
                ghichu: body.ghichu ? body.ghichu.trim() : '',
                nguoitao_id: body.nguoitao_id,
                trangthai: ENUM.ENABLE,
                tongdonhang: toNumber(body.tongdonhang) || 0,
                discountAmount: toNumber(body.discountAmount) || 0,
            });

            const banleID = rowcreated.id;
            const banle_sanpham = this.convertDetails(body.listSP, banleID);
            await BL_SP.bulkCreate(banle_sanpham);

            await transaction.commit();
            return rowcreated;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }

    async printBill(userId, mode, payload) {
        if (![PRINT_MODE.A5, PRINT_MODE.K80].includes(mode)) {
            throw new BadRequestException(
                `Định dạng ${mode} không được hỗ trợ. Vui lòng chọn khổ K80 hoặc A5.`,
            );
        }
        const templateInvoiceByMode = `${templateBillPath}${mode}`;

        const invoiceTemplate = await getDataTemplate(templateInvoiceByMode);

        const mappedData = await _mapToBillPrint(userId, payload);
        const conventedInvoiceTemplate = replaceValueHtml(invoiceTemplate, mappedData);

        return conventedInvoiceTemplate;
    }
}

const _mapToBillPrint = async (userId, payload) => {
    const createById = toNumber(payload.nguoitao_id) || toNumber(userId) || null;
    const user = await getOneUser(createById);

    const createByName = user ? user.tendaydu : '';
    const customerName = payload.ten || 'Khách lẻ';

    const totalAmount = (payload.listSP || []).reduce((sum, item) => {
        const price = toNumber(item.gia) || 0;
        const quantity = toNumber(item.soluong) || 0;
        const discountAmount = toNumber(item.discountAmount) || 0;
        return sum + price * quantity - discountAmount;
    }, 0);
    const discountAmount = toNumber(unMaskPrice(payload.discountAmount)) || 0;
    const detailProducts = _makeHtmlTableServicesToRender(payload);
    const totalAmountAfterDiscount = totalAmount - discountAmount;

    return {
        customerName: customerName,
        detailProducts: detailProducts,
        totalAmount: formatPrice(totalAmount) || '0',
        discountAmount: formatPrice(discountAmount) || '0',
        totalAmountAfterDiscount: formatPrice(totalAmountAfterDiscount) || '0',
        priceToText: convertNumberToText(totalAmountAfterDiscount) || '',
        createByName: createByName,
        createAtDateTime: getCurrentDate(),
    };
};

const _makeHtmlTableServicesToRender = (payload) => {
    const products = payload.listSP;
    if (isEmpty(products)) return '';

    let htmlTable = '';
    for (const product of products) {
        const quantity = toNumber(product.soluong) || 0;
        const discountAmount = toNumber(product.discountAmount) || 0;
        const price = toNumber(product.gia) || 0;
        const mapProduct = {
            name: product.tenthaythe || '',
            quantity: quantity,
            price: price,
            discountAmount: discountAmount,
            totalAmount: price * quantity - discountAmount,
        };
        htmlTable += makeHtmlTableServiceItemToRender(mapProduct);
    }
    return htmlTable;
};

const makeHtmlTableServiceItemToRender = (serviceItem) => {
    const rowTableProductItem = ` 
    <tr class=" border-top-1">
            <td colspan="4">${serviceItem.name}</td>
          </tr>
          <tr class="text-center">
            <td>${serviceItem.quantity}</td>
            <td>${formatPrice(serviceItem.price)}</td>
            <td>${formatPrice(serviceItem.discountAmount)}</td>
            <td class="text-right">${formatPrice(serviceItem.totalAmount)}</td>
          </tr>
  `;

    return rowTableProductItem;
};

module.exports = new OrderService();
