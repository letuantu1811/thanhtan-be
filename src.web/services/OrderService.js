const path = require('path');
const {bootstrapCssPath, templateExamInvoicePath, rebootCssPath, bootstrapGridCssPath, } = require('../../config');
const { replaceValueHtml } = require('../../utils/template');
const { getDataTemplate } = require('../../utils/template');

class OrderService {
    // getInvoiceTemplate = async (mode) => {
    //     const templateInvoiceByMode = `${templateExamInvoicePath}${mode}`;

    //     const invoiceTemplate = await getDataTemplate(templateInvoiceByMode);

    //     const extensionCss = 'css'
    //     const rebootCss = await getDataTemplate(rebootCssPath, extensionCss);
    //     const bootstrapCss = await getDataTemplate(bootstrapCssPath, extensionCss);
    //     const bootstrapGrid = await getDataTemplate(bootstrapGridCssPath, extensionCss);


    //     const params = {
    //         rebootCss: rebootCss,
    //         bootstrapCss: bootstrapCss,
    //         bootstrapGridCss: bootstrapGrid,
    //     }
    //     const conventedInvoiceTemplate = replaceValueHtml(invoiceTemplate, params);
    //     return conventedInvoiceTemplate;
    // };

    getInvoiceTemplate = async (mode) => {
            const templateInvoiceByMode = `${templateExamInvoicePath}${mode}`;
    
            const invoiceTemplate = await getDataTemplate(templateInvoiceByMode);

            return invoiceTemplate;
        };
}

module.exports = new OrderService();
