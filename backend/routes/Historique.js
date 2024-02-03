const express = require('express');
const router = express.Router();

const { getHistorique, createHistorique, getHistEnvoi } = require('../controllers/HistoriqueController');

router.get('/historique', getHistorique);
router.post('/historique', createHistorique);
router.get('/histEnvoi', getHistEnvoi); 

module.exports = router;
