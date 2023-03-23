const { response } = require("../../utils/api.res");
const { getInvoiceTemplate } = require("../services/TreetmentFormService");

class TreetmentFormController {
  async getInvoiceTemplateByMode(req, res) {
    const mode = req.params.mode.toUpperCase();

    try {
      const treetmentForm = await getInvoiceTemplate(mode);
      return response.success(res, 'Lấy mẫu in  thành công.', treetmentForm);
    } catch (err) {
      console.log(err.message);
      return response.error(res, err.message, 500, req.url);
    }
  }
}

module.exports = new TreetmentFormController();
