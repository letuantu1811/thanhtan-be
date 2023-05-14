const { response } = require("../../utils/api.res");
const { getInvoiceTemplateByMode } = require("../services/TreatmentFormService");

class TreatmentFormController {
  async getInvoiceTemplateByMode(req, res) {
    const mode = req.params.mode.toUpperCase();
    const payload = req.body
    try {
      const treatmentForm = await getInvoiceTemplateByMode(mode, payload);
      return response.success(res, 'Lấy mẫu in  thành công.', treatmentForm);
    } catch (err) {
      console.log(err.message);
      return response.error(res, err.message, 500, req.url);
    }
  }
}

module.exports = new TreatmentFormController();
