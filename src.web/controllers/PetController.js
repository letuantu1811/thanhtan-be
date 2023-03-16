const { response } = require("../../utils/api.res");
const PetService = require("../services/PetService");

class PetController {
    getPets = async (req, res) => {
        try {
            const result = await PetService.getPets();

            return response.success(res, 'success', result);
        } catch (err) {
            console.log('Error at getCustomers:', err.message);
            return response.error(res, err.message, 500, req.originalUrl);
        }
    };
}

module.exports = new PetController();
