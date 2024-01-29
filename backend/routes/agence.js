const express = require('express')
const router = express.Router()
const { createAgence, getAgences, updateAgence, deleteAgence } = require('../controllers/AgenceController') 

router.get('/agence', getAgences);
router.post('/agence', createAgence);
router.put('/agence/:id', updateAgence);
router.delete('/agence/:id', deleteAgence);

module.exports = router;