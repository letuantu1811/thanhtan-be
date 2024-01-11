const express = require('express');

const router = express.Router();
const dieutri = require('../../src.web/controllers/dieutri.controller');
const truyxuatbenhan = require('../../src.web/controllers/truyxuatbenhan.controller');
const response = require('../../utils/api.res/response');
const { getInvoiceTemplateByMode } = require('../../src.web/controllers/TreatmentFormController');

router.get('/notification', async (req, res) => {
    const role = req.header('quyen');
    try {
        const result = await dieutri.getNotification(role);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    const dateselect = req.query.date;
    console.log(req);
    try {
        const result = await dieutri.getAllToday(dateselect, isAdmin);

        const arr = [];
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

// Exam today pagination
router.get('/v2', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    const dateselect = req.query.date;
    const paramsCustomer = req.query.paramsCustomer;
    const petName = req.query.petName;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;

    try {
        const result = await dieutri.getAllToday_v2(pageSize, pageNum, dateselect, paramsCustomer, petName, isAdmin);

        const arr = [];
        if (!isAdmin) {
            for (let index = 0; index < result.data.length; index++) {
                const element = result.data[index];
                if ((await dieutri.filterBlockedInExam(element.id)) === 0) {
                    arr.push(element);
                }
            }
            const totalItems = arr.length; 
            const totalPages =  Math.ceil(totalItems / pageSize);
            const start = (pageNum - 1) * pageSize;
            const end = pageSize * pageNum - 1;
            const data = arr.slice(start, end);

            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            };           
            response.success_v2(res, 'Lấy dữ liệu thành công', data, pagination);
            return;
        }

        response.success_v2(res, 'Lấy dữ liệu thành công', !isAdmin ? arr : result.data, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/detail/:id', async (req, res) => {
    const id = req.params.id;
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
        response.error(res, err.message, 500);
    }
});

// Reexam pagination
router.get('/reexam_v2', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const paramsCustomer = req.query.paramsCustomer;
    const petName = req.query.petName;

    const role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    const date = req.query.date;
    try {
        const result = await dieutri.getReExamByDate_v2(pageSize, pageNum, date, isAdmin, paramsCustomer, petName, isAdmin);
        const arr = [];
        if (!isAdmin) {
            for (let index = 0; index < result.data.length; index++) {
                const element = result.data[index];
                if ((await dieutri.filterBlockedInExam(element.id)) === 0) {
                    arr.push(element);
                }
            }
            const totalItems = arr.length; 
            const totalPages =  Math.ceil(totalItems / pageSize);
            const start = (pageNum - 1) * pageSize;
            const end = pageSize * pageNum - 1;
            const data = arr.slice(start, end);

            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            };           
            response.success_v2(res, 'Lấy dữ liệu thành công', data, pagination);
            return;
        }

        response.success_v2(res, 'Lấy dữ liệu thành công', !isAdmin ? arr : result.data, result.pagination);

    } catch (err) {
        console.log('Error at dieutri.router >> /reexam:', err.message);
        response.error(res, err.message, 500);
    }
});

router.post('/create', async (req, res) => {
    const body = req.body;
    try {
        const result = await dieutri.create(body);

        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/createHoSo', async (req, res) => {
    const body = req.body;
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
    const body = req.body;
    try {
        const result = await dieutri.importEXAM(body);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});
router.post('/importSP', async (req, res) => {
    const body = req.body;
    try {
        const result = await dieutri.importServicePlus(body);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/all', async (req, res) => {
    const role = req.header('quyen');
    try {
        const result = await dieutri.getAll(role);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/examByPetId', async (req, res) => {
    try {
        const role = req.header('quyen');
        const isViewedNonRestricted = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
        const id = req.query.id;
        const phieudieutriid = req.query.phieudieutriid;
        console.log(phieudieutriid + '123');
        const result = await dieutri.getAllExamByPetId(id, isViewedNonRestricted);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.put('/updateHSBA', async (req, res) => {
    const data = req.body;
    try {
        const result = await dieutri.updateHSBA(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.put('/updatePet', async (req, res) => {
    const data = req.body;
    try {
        const result = await dieutri.updatePet(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.delete('/deletePet', async (req, res) => {
    const data = req.query.id;
    try {
        const result = await dieutri.deletePet(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.delete('/deleteDT', async (req, res) => {
    const data = req.query.id;
    try {
        const result = await dieutri.deleteDT(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.put('/deleteDTMulti', async (req, res) => {
    const data = req.body;
    try {
        const result = await dieutri.deleteDTMulti(data);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/getExaminationWithRabisin', async (req, res) => {
    try {
        const result = await truyxuatbenhan.getExaminationWithRabisin();
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

// Pagination getExaminationWithRabisin
router.get('/getExaminationWithRabisin_v2', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const paramsCustomer = req.query.paramsCustomer;
    const petName = req.query.petName;

    try {
        const result = await truyxuatbenhan.getExaminationWithRabisin_v2(pageSize, pageNum, fromDate, toDate, paramsCustomer, petName);

        response.success_v2(res, 'success', result.data, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/getExaminationWithMedicin/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await truyxuatbenhan.getExaminationWithMedicinName(id);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/getExaminationWithMedicin_v2/:id', async (req, res) => {
    const id = req.params.id;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    try {
        const result = await truyxuatbenhan.getExaminationWithMedicinName_v2(id, pageSize, pageNum, fromDate, toDate, isAdmin);
        response.success_v2(res, 'success', result.data, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/getPetExamination', async (req, res) => {
    const role = req.header('quyen');
    const arr = [];
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

// Paging Pet Examination 
router.get('/getPetExamination_v2', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = ['ADMIN', 'MANAGER'].includes(role.toUpperCase());
    const pageSize = parseInt(req.query.pageSize) || 20;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const phone = req.query.phone;
    const name = req.query.name;
    const address = req.query.address;
    const petName = req.query.petName;

    try {
        if (!isAdmin) {
            const arr = [];
            const temp = await dieutri.getPetExaminationPaging(150, 1, phone, name, address, petName, isAdmin);
            const results = temp.data;
            for (let index = 0; index < results.length; index++) {
                let count = 0;
                for (let index2 = 0; index2 < results[index].phieudieutris.length; index2++) {
                    const element2 = results[index].phieudieutris[index2];
                    if ((await dieutri.filterBlockedInExam(element2.id)) === 0) {
                        count++; 
                    }
                }
                count > 1 && arr.push(results[index]);
            }
            const totalItems = arr.length; 
            const totalPages =  Math.ceil(totalItems / pageSize);
            const start = (pageNum - 1) * pageSize;
            const end = pageSize * pageNum - 1;
            const data = arr.slice(start, end);

            const pagination = {
                totalPages,
                currentPage: pageNum,
                pageSize,
                totalItems,
            };           
            response.success_v2(res, 'success', data, pagination);
            return;
        }

        const result = await dieutri.getPetExaminationPaging(pageSize, pageNum, phone, name, address, petName, isAdmin);        
        response.success_v2(res, 'success', result.data, result.pagination);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/getPetMedicalHistory/:id', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = role.toUpperCase() === 'ADMIN';
    const petID = req.params.id;
    try {
        const result = await dieutri.getPetMedicalHistory(petID, isAdmin);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/getPetMedicalHistory_v2/:id', async (req, res) => {
    const role = req.header('quyen');
    const isAdmin = role.toUpperCase() === 'ADMIN';
    const petID = req.params.id;
    try {
        const result = await dieutri.getPetMedicalHistory_v2(petID, isAdmin);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.get('/isExisted/:id', async (req, res) => {
    const petID = req.params.id;
    try {
        const result = await dieutri.isExisted(petID);
        response.success(res, 'success', result);
    } catch (err) {
        console.log(err.message);
        response.error(res, 'failed', 500);
    }
});

router.post('/prints/:mode', getInvoiceTemplateByMode);

module.exports = router;