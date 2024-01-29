const express = require('express');
const router =  express.Router()

const{ getFonctions }  = require('../controllers/FonctionController.js');

router.get('/fonctions', getFonctions);

module.exports = router