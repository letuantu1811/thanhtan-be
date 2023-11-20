const express = require('express');

const router = express.Router();
const controller = require('../../src.web/controllers/nhomsanpham.controller');
const response = require('../../utils/api.res/response');

router.get('/', async (req, res) => {
    try {
        const result = await controller.getAll();

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Creating appointment
router.post('/', async (req, res) => {
    const body = req.body;
    try {
        const result = await controller.create(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.put('/', async (req, res) => {
    const body = req.body;
    try {
        const result = await controller.update(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.delete('/:id', async (req, res) => {
    const body = req.params.id;
    try {
        const result = await controller.deleteCategory(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/disable/:id', async (req, res) => {
    const body = req.params.id;
    try {
        const result = await controller.disable(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Getting many appointment
router.get('/products/:id', async (req, res) => {
    try {
        const result = await controller.getMany(req.params.id);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

module.exports = router;
