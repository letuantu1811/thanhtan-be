const path = require('path');
const config = require('../../config');
const { readFileAsync } = require('../../utils/file.helper');
const { getDataTemplate } = require('../../utils/template');

class OrderService {
    getInvoiceTemplate = async () => {
        const templateInvoicePath = config.templatePath.replace('{mode}', 'k80')

        const invoiceTemplate = await getDataTemplate(templateInvoicePath);
        return invoiceTemplate;
    };
}

module.exports = new OrderService();
