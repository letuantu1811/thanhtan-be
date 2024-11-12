const express = require("express");
const router = express.Router();

const CustomerController = require('../../src.web/controllers/khachhang.controller');
const response = require('../../utils/api.res/response');

router.get("/", async(req, res) => {    
    const role = req.header('quyen');
    const isAdmin = role.toUpperCase() === 'ADMIN';
    try {
        const customers = await CustomerController.getCustomers(isAdmin);
        response.success(res, 'success', customers);
    } catch (err) {
        console.log('Error at getCustomers:', err.message);
        response.error(res, err.message, 500);
    }
});

// pagination customers
router.get("/v2", async(req, res) => {    
    const role = req.header('quyen');
    const isAdmin = role.toUpperCase() === 'ADMIN';
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const phone = req.query.phone;
    const name = req.query.name;
    const address = req.query.address;
    const clienteles = req.query.clienteles;
    try {
        const results = await CustomerController.getCustomers_v2(pageSize, pageNum, phone, name, address, clienteles);
        response.success_v2(res, 'success', results.customers, results.pagination);
    } catch (err) {
        console.log('Error at getCustomers:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await CustomerController.create(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at create:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post("/new", async(req, res) => {
    let body = req.body;
    try {
        const result = await CustomerController.createCustomer(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at createCustomer:', err.message);
        response.error(res, err.message, 500);
    }
});

router.put("/", async(req, res) => {
    let body = req.body;
    try {
        const result = await CustomerController.updateCustomer(body);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at updateCustomer:', err.message);
        response.error(res, err.message, 500);
    }
});

router.delete("/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await CustomerController.deleteCustomer(id);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at deleteCustomer:', err.message);
        response.error(res, err.message, 500);
    }
});

router.get("/pet", async(req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const petName = req.query.petName;    
    const phone = req.query.phone;
    const name = req.query.name;
    const address = req.query.address;

    try {
        const results = await CustomerController.getPet(pageSize, pageNum, petName ,phone, name, address);
        response.success_v2(res, 'success', results.petResult, results.pagination);
    } catch (err) {
        response.error(res, err.message, 500);
    }
});

router.get("/pet/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await CustomerController.getOnePet(id);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at deleteCustomer:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post("/newpet", async(req, res) => {
    try {
        const result = await CustomerController.createNewPet(req.body);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at createNewPet:', err.message);
        response.error(res, err.message, 500);
    }
});

/*
@param id:  the id of the pet
*/
router.put("/pet", async(req, res) => {
    let body = req.body;
    try {
        console.log(body);
        const result = await CustomerController.editPet(body);
        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at editPet:', err.message);
        response.error(res, err.message, 500);
    }
});

// Delete thu cung
router.delete("/pet/:id", async(req, res) => {
    let id = req.params.id;
    try {
        const result = await CustomerController.disablePet(id);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at disablePet:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post("/import", async(req, res) => {
    let data = req.body;
    try {
        console.log("Ádasd");
        const result = await CustomerController.importCustomer(data);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at importCustomer:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post("/importPet", async(req, res) => {
    let data = req.body;
    try {
        const result = await CustomerController.importPet(data);

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at importPet:', err.message);
        response.error(res, err.message, 500);
    }
});

router.get("/filter", async(req, res) => {
    // let data = req.body;
    try {
        const result = await CustomerController.locKH();

        response.success(res, "success", result)
    } catch (err) {
        console.log('Error at locKH:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post("/gophoso", async(req, res) => {
    const id = req.body.id;
    const phone = req.body.phone;
    try {
        const result = await CustomerController.gopHoSo(id, phone);

        response.success(res, "success", result)
    } catch (err) {
        response.error(res, err.message, 500);
    }
});

router.post("/gopthucung", async(req, res) => {
    const id = req.body.id;
    const namePet = req.body.namePet;
    const khId = req.body.khId;
    try {
        const result = await CustomerController.gopThuCung(id, namePet, khId);

        response.success(res, "success", result)
    } catch (err) {
        response.error(res, err.message, 500);
    }
});


module.exports = router;