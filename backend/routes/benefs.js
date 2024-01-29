const express = require('express');
const router =  express.Router()

const { createBenefs, getBenefs, updateBenefs, deleteBenefs } = require("../controllers/BenefsController.js");

router.get('/benefs', getBenefs);
router.post('/benefs', createBenefs);
router.post('/benefs/upload', updateBenefs);
router.delete('/benefs/:id', deleteBenefs);

module.exports = router;