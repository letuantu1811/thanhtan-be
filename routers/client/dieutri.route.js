const express = require('express');
const router = express.Router();
const dieutri = require('../../src.web/controllers/dieutri.controller');
const truyxuatbenhan = require('../../src.web/controllers/truyxuatbenhan.controller');
const response = require('../../utils/api.res/response');
const fs = require('fs');

// Getting many khachhang
router.get('/notification', async (req, res) => {
    let role = req.header('quyen');
    try {
        const result = await dieutri.getNotification(role);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/', async (req, res) => {
    // let body = req.body;
    let role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    let dateselect = req.query.date;
    console.log(req);
    try {
        const result = await dieutri.getAllToday(dateselect, isAdmin);

        let arr = [];
        if (!isAdmin) {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if ((await dieutri.filterBlockedInExam(element.id)) === 0) {
                    arr.push(element);
                }
            }
        }

        response.success(res, 'success', !isAdmin ? arr : result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/detail/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const result = await dieutri.getOne(id);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/reexam', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    const date = req.query.date;
    try {
        const result = await dieutri.getReExamByDate(date, isAdmin);
        const arr = [];
        if (!isAdmin) {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if ((await dieutri.filterBlockedInExam(element.id)) === 0) {
                    arr.push(element);
                }
            }
        }

        response.success(res, 'Lấy dữ liệu thành công', !isAdmin ? arr : result);
    } catch (err) {
        console.log('Error at dieutri.router >> /reexam:', err.message);
        response.error(res, 'Lỗi lấy dữ liệu', 500);
    }
});

// Creating khachhang
router.post('/create', async (req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.create(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
// Creating khachhang
router.post('/createHoSo', async (req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.createHoSo(body);
        console.log(result);
        response.success(res, 'success', result);
    } catch (err) {
        console.log('createHoSo', err.message);
        response.error(res, err.message, 500);
    }
});
router.post('/importEXAM', async (req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.importEXAM(body);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.post('/importSP', async (req, res) => {
    let body = req.body;
    try {
        const result = await dieutri.importServicePlus(body);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Getting many khachhang
router.get('/all', async (req, res) => {
    let role = req.header('quyen');
    try {
        const result = await dieutri.getAll(role);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Getting many exam by pet id
router.get('/examByPetId', async (req, res) => {
    try {
        const role = req.header('quyen');
        const isViewedNonRestricted = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
        let id = req.query.id;
        let phieudieutriid = req.query.phieudieutriid;
        console.log(phieudieutriid + '123');
        const result = await dieutri.getAllExamByPetId(id, isAdmin);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Update many exam by pet id
router.put('/updateHSBA', async (req, res) => {
    let data = req.body;
    try {
        const result = await dieutri.updateHSBA(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Update pet by pet id
router.put('/updatePet', async (req, res) => {
    let data = req.body;
    try {
        const result = await dieutri.updatePet(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// delete pet by pet id
router.delete('/deletePet', async (req, res) => {
    let data = req.query.id;
    try {
        const result = await dieutri.deletePet(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
// deleteDT by pet id
router.delete('/deleteDT', async (req, res) => {
    let data = req.query.id;
    try {
        const result = await dieutri.deleteDT(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
// Getting many exam by pet id
router.get('/getExaminationWithRabisin', async (req, res) => {
    try {
        const result = await truyxuatbenhan.getExaminationWithRabisin();
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Getting many exam by pet id
router.get('/getExaminationWithMedicin/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const result = await truyxuatbenhan.getExaminationWithMedicinName(id);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

//get pets examination
router.get('/getPetExamination', async (req, res) => {
    let role = req.header('quyen');
    let arr = [];
    try {
        const result = await dieutri.getPetExamination();
        if (role.toUpperCase() === 'USER') {
            for (let index = 0; index < 150; index++) {
                for (let index2 = 0; index2 < result[index].phieudieutris.length; index2++) {
                    const element2 = result[index].phieudieutris[index2];
                    if ((await dieutri.filterBlockedInExam(element2.id)) === 0) {
                        arr.push(result[index]);
                    }
                }
            }
        }
        response.success(res, 'success', role.toUpperCase() === 'USER' ? arr : result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

//get pets examination
router.get('/getPetMedicalHistory/:id', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = role.toUpperCase() === 'ADMIN';
    let petID = req.params.id;
    try {
        const result = await dieutri.getPetMedicalHistory(petID, isAdmin);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

//get existed cur date
router.get('/isExisted/:id', async (req, res) => {
    let petID = req.params.id;
    try {
        const result = await dieutri.isExisted(petID);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

module.exports = router;
