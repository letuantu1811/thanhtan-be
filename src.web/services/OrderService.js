const path = require('path');
const {templateExamInvoicePath, } = require('../../config');
const { replaceValueHtml } = require('../../utils/template');
const { getDataTemplate } = require('../../utils/template');

class OrderService {

    getInvoiceTemplate = async (mode) => {
            const templateInvoiceByMode = `${templateExamInvoicePath}k80`;
    
            const invoiceTemplate = await getDataTemplate(templateInvoiceByMode);

            return invoiceTemplate;
        };
}

module.exports = new OrderService();
