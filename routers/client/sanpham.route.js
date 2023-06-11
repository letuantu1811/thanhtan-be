const express = require('express');

const router = express.Router();
const controller = require('../../src.web/controllers/sanpham.controller');
const response = require('../../utils/api.res/response');

router.get('/', async (req, res) => {
    const quyen = req.header('quyen');
    try {
        const result = await controller.getAll(quyen);
        //
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/inventory', async (req, res) => {
    try {
        const result = await controller.getInventory();

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.get('/medicines', async (req, res) => {
    const role = req.header('quyen');
    console.log(role);
    try {
        const result = await controller.getAllMedicines(role);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/create', async (req, res) => {
    const body = req.body;
    try {
        const result = await controller.create(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/createMulti', async (req, res) => {
    const body = req.body;
    try {
        const result = await controller.createMulti(body);

        response.success(res, 'success', result);
    } catch (err) {
        response.error(res, err, 500);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await controller.getMany(req.body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await controller.disable(id);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.put('/', async (req, res) => {
    const data = req.body;
    try {
        const result = await controller.update(data);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.post('/import', async (req, res) => {
    const data = req.body;
    try {
        const result = await controller.importData(data);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/createOne', async (req, res) => {
    const body = req.body;
    try {
        const result = await controller.createOne(body);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/barcode', async (req, res) => {
    const quyen = req.header('quyen');
    console.log(quyen);
    try {
        const result = await controller.getAllForBarCode(quyen);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/addbarcode', async (req, res) => {
    const quyen = req.header('quyen');
    const data = req.body;
    console.log(quyen);
    try {
        const result = await controller.addbarcode(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

module.exports = router;
