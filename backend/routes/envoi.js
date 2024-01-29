const express = require('express');
const router = express.Router();

const { getCombinedData, getEnvoi, createEnvoi, createEnvoiUpload } = require('../controllers/EnvoiController.js');

router.get('/envoi', getEnvoi);
router.get("/combinedData", getCombinedData);
router.post('/envoi', createEnvoi);
router.post('envoi/upload', createEnvoiUpload);

module.exports = router;