const { isEmpty, toNumber, sumBy } = require('lodash');
const { templateExamInvoicePath } = require('../../config');
const { BadRequestException } = require('../../utils/api.res/api.error');
const { PRINT_MODE } = require('../../utils/enum');
const { formatDate, getCurrentDate } = require('../../utils/formatDate');
const { getDataTemplate, replaceValueHtml } = require('../../utils/template');
const { unMaskPrice, formatPrice, convertNumberToText } = require('../../utils/string');

class TreatmentFormService {
	getInvoiceTemplateByMode = async (mode, payload) => {
		if (![PRINT_MODE.A5, PRINT_MODE.K80].includes(mode)) {
			throw new BadRequestException(`Định dạng ${mode} không được hỗ trợ. Vui lòng chọn khổ K80 hoặc A5.`);
		}

		const templatePath = `${templateExamInvoicePath}${mode}`;

		const invoiceTemplate = await getDataTemplate(templatePath);

		const mappedData = mapToExaminationFormPrint(payload);
		const conventedInvoiceTemplate = replaceValueHtml(invoiceTemplate, mappedData);

		return conventedInvoiceTemplate;
	};
}

const mapToExaminationFormPrint = (payload) => {
	const totalAmount = calculateTotalAmount(payload);
	const discountMember = totalAmount ? (totalAmount * toNumber(payload.addedDiscountAmount)) / 100 : 0;
	const totalAmountAfterDiscount = totalAmount - discountMember - toNumber(unMaskPrice(payload.discountAmount));

	// const details = makeHtmlTableTotalProductsToRender(payload, totalAmount);
	const detailProducts = makeHtmlTableTotalProductsToRender(payload);
	const detailServices = makeHtmlTableServicesToRender(payload);

	return {
		numberOfForm: payload.sophieudieutri || '0',
		customerName: payload.khachhang.ten || '',
		customerAddress: payload.khachhang.diachi || '',
		petName: payload.thucung.ten || '',
		dateOfExamination: formatDate(payload.ngaykham) || '',
		dateOfReExamination: formatDate(payload.ngaytaikham) || '',
		detailServices: detailServices,
		detailProducts: detailProducts,
		totalAmount: formatPrice(totalAmount),
		discountMember: formatPrice(discountMember),
		discountAmount: formatPrice(payload.discountAmount),
		totalAmountAfterDiscount: formatPrice(totalAmountAfterDiscount),
		priceToText: convertNumberToText(totalAmountAfterDiscount),
		createByName: payload.bacsi.ten,
		createAtDateTime: getCurrentDate(),
	};
};

const calculateTotalAmount = (payload) => {
	const services = payload.dsCDV;
	const products = payload.dsSP;
	if (isEmpty(products) && isEmpty(services)) return 0;
	const totalAmountServices = sumBy(services, (service) => toNumber(unMaskPrice(service.gia))) || 0;
	const totalAmountProducts = sumBy(products, (product) => toNumber(product.gia)) || 0;

	return totalAmountServices + totalAmountProducts;
};

const makeHtmlTableTotalProductsToRender = (payload) => {
	const services = payload.dsCDV;
	const products = payload.dsSP;

	const productAsDrugMoney = services.filter((service) => service.id === 159);
	const amountProductAsDrugMoney = productAsDrugMoney.length ? toNumber(unMaskPrice(productAsDrugMoney[0].gia)) : 0;
	if (isEmpty(products) && isEmpty(productAsDrugMoney)) return '';

	const sumProducts = sumBy(products, (product) => toNumber(product.gia)) || 0;

	const contentTable = {
		name: 'TIỀN THUỐC',
		quantity: 1,
		price: sumProducts + amountProductAsDrugMoney,
		discountAmount: 0,
		totalAmount: sumProducts + amountProductAsDrugMoney,
	};

	return makeHtmlTableServiceItemToRender(contentTable);
};

const makeHtmlTableServicesToRender = (payload) => {
	const services = payload.dsCDV;
	if (isEmpty(services)) return '';

	const servicesFiltersDrugMoney = services.filter((service) => service.id !== 159);

	let htmlTable = '';
	for (const service of servicesFiltersDrugMoney) {
		const mapServiceItem = {
			name: service.ten || '',
			quantity: 1,
			price: toNumber(unMaskPrice(service.gia)) || 0,
			discountAmount: 0,
			totalAmount: toNumber(unMaskPrice(service.gia)) || 0,
		};
		htmlTable += makeHtmlTableServiceItemToRender(mapServiceItem);
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

module.exports = new TreatmentFormService();
