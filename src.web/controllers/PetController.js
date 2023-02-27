const { response } = require("../../utils/api.res");
const { createPet, updatePet } = require("../services/PetService");

exports.createPet = async (req, res) => {
    try {
        const dataRes = await createPet(req.body);

        return response.success(res, 'success', dataRes);
    } catch (error) {
        console.log('Error at createPet: ', error);
        return response.error(res, error.message, error.statusCode);
    }
};

exports.updatePet = async (req, res) => {
    try {
        const dataRes = await updatePet(req.body);

        return response.success(res, 'success', dataRes);
    } catch (error) {
        console.log('Error at updatePet: ', error);
        return response.error(res, error.message, error.statusCode);
    }
};
