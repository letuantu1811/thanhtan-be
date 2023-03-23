const { templateExamInvoicePath } = require("../../config");
const { BadRequestException } = require("../../utils/api.res/api.error");
const { PRINT_MODE } = require("../../utils/enum");
const { getDataTemplate } = require("../../utils/template");

class TreetmentFormService {
  getInvoiceTemplate = async (mode) => {
    if (![PRINT_MODE.A5, PRINT_MODE.K80].includes(mode)) {
      throw new BadRequestException(`Định dạng ${mode} không được hỗ trợ. Vui lòng chọn khổ K80 hoặc A5.`);
    }

    const templateInvoiceByMode = `${templateExamInvoicePath}${mode}`;

    const invoiceTemplate = await getDataTemplate(templateInvoiceByMode);

    return invoiceTemplate;
  };
}

module.exports = new TreetmentFormService();
