const express = require('express');

const router = express.Router();
const {
    getAll,
    getInventory,
    getAllMedicines,
    create,
    createMulti,
    getMany,
    disable,
    update,
    importData,
    createOne,
    getAllForBarCode,
    addBarcode,
    generateBarcode,
} = require('../../src.web/controllers/sanpham.controller');
const response = require('../../utils/api.res/response');

router.get('/', async (req, res) => {
    const quyen = req.header('quyen');
    try {
        const result = await getAll(quyen);
        //
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/inventory', async (req, res) => {
    try {
        const result = await getInventory();

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
        const result = await getAllMedicines(role);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/create', async (req, res) => {
    const body = req.body;
    try {
        const result = await create(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/createMulti', async (req, res) => {
    const body = req.body;
    try {
        const result = await createMulti(body);

        response.success(res, 'success', result);
    } catch (err) {
        response.error(res, err, 500);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await getMany(req.body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await disable(id);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.put('/', async (req, res) => {
    const data = req.body;
    try {
        const result = await update(data);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.post('/import', async (req, res) => {
    const data = req.body;
    try {
        const result = await importData(data);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/createOne', async (req, res) => {
    const body = req.body;
    try {
        const result = await createOne(body);
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
        const result = await getAllForBarCode(quyen);
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
        const result = await addBarcode(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.patch('/:id/gen-barcode', generateBarcode);

module.exports = router;
