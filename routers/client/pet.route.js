const express = require('express');
const router = express.Router();

const { getPets } = require('../../src.web/controllers/PetController');

router.get('/', getPets);

module.exports = router;
