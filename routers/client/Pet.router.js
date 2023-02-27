const express = require('express');
const { createPet } = require('../../src.web/services/PetService');
const router = express.Router();

router.route('/').post(createPet).put(updatePet);

module.exports = router;
