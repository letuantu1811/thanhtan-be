const express = require('express');

const router = express.Router();
const {
    getAll,
    getAll_v2,
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
    almostOut,
    statistic,
    thanQuantity
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

//Pagination Products
router.get('/v2', async (req, res) => {
    const quyen = req.header('quyen');
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const productName = req.query.productName;
    const category = req.query.category;
    try {
        const result = await getAll_v2(quyen, pageSize, pageNum, productName, category);
        //
        response.success_v2(res, 'success', result.product, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

//Almost Out Products
router.get('/almost-out', async (req, res) => {
    const quyen = req.header('quyen');
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const barcode = req.query.barcode;
    const productName = req.query.productName;
    const category = req.query.category;
    try {
        const result = await almostOut(quyen, pageSize, pageNum, barcode, productName, category);
        //
        response.success_v2(res, 'success', result.product, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

//Almost Out Products
router.get('/than-quantity', async (req, res) => {
    const quyen = req.header('quyen');
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const barcode = req.query.barcode;
    const productName = req.query.productName;
    const category = req.query.category;
    try {
        const result = await thanQuantity(quyen, pageSize, pageNum, barcode, productName, category);
        //
        response.success_v2(res, 'success', result.product, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

//statistic Products
router.get('/statistic', async (req, res) => {
    const quyen = req.header('quyen');
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const barcode = req.query.barcode;
    const productName = req.query.productName;
    const category = req.query.category;
    try {
        const result = await statistic(quyen, pageSize, pageNum, barcode, productName, category);
        //
        response.success_v2(res, 'success', result.product, result.pagination);
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
