const path = require('path');
const { templateBillPath } = require('../../config');
const { replaceValueHtml } = require('../../utils/template');
const { getDataTemplate } = require('../../utils/template');
const { getOneUser } = require('../controllers/thanhvien.controller');
const { toNumber, isEmpty } = require('lodash');
const { formatPrice, convertNumberToText, unMaskPrice } = require('../../utils/string');
const { getCurrentDate } = require('../../utils/formatDate');

class OrderService {
    async getInvoiceTemplate(userId, mode, payload) {
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

    const totalAmount = toNumber(unMaskPrice(payload.tongdonhang)) || 0;
    const detailProducts = _makeHtmlTableServicesToRender(payload);

    return {
        customerName: customerName,
        detailProducts: detailProducts,
        totalAmount: formatPrice(totalAmount) || '0',
        discountAmount: formatPrice(toNumber) || '0',
        totalAmountAfterDiscount: formatPrice(totalAmount) || '0',
        priceToText: convertNumberToText(totalAmount) || '',
        createByName: createByName,
        createAtDateTime: getCurrentDate(),
    };
};

const _makeHtmlTableServicesToRender = (payload) => {
    const products = payload.listSP;
    if (isEmpty(products)) return '';

    let htmlTable = '';
    for (const product of products) {
        const mapProduct = {
            name: product.tenthaythe || '',
            quantity: toNumber(product.soluong) || 0,
            price: toNumber(unMaskPrice(product.gia)) || 0,
            discountAmount: 0,
            totalAmount: toNumber(unMaskPrice(product.thanhtien)) || 0,
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
            <td>${serviceItem.discountAmount}</td>
            <td class="text-right">${formatPrice(serviceItem.totalAmount)}</td>
          </tr>
  `;

    return rowTableProductItem;
};

module.exports = new OrderService();
