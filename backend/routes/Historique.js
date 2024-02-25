const express = require('express');
const router = express.Router();

const { getHistorique, createHistorique, getHistEnvoi, updateHistorique } = require('../controllers/HistoriqueController');

router.get('/historique', getHistorique);
router.post('/historique', createHistorique);
router.get('/histEnvoi', getHistEnvoi); 
router.put('/historique/:id', updateHistorique);


module.exports = router;
