const express = require('express')
const router = express.Router()
const { createGroup, getGroup, updateGroup, deleteGroup, getGroups } = require('../controllers/GroupementController.js'); 

router.get('/groupement', getGroups);
router.get('/groupement/:grpCode', getGroup)
router.post('/groupement', createGroup);
router.put('/groupement/:id', updateGroup);
router.delete('/groupement/:id', deleteGroup);

module.exports = router;