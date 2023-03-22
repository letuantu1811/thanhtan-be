const path = require('path');
const config = require('../../config');
const { readFileAsync } = require('../../utils/file.helper');
const { getDataTemplate } = require('../../utils/template');

class OrderService {
    getInvoiceTemplate = async (mode) => {
        const templateExamInvoicePath = config.templateExamInvoicePath;
        const templateInvoiceByMode = `${templateExamInvoicePath}${mode}`;

        const invoiceTemplate = await getDataTemplate(templateExamInvoicePath);
        return invoiceTemplate;
    };
}

module.exports = new OrderService();
