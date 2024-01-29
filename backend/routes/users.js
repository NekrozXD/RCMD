const express = require("express");
const router = express.Router();

const { getUsers, CreateUser, UpdateUser, DeleteUser } = require('../controllers/UserController.js');

router.get('/utilisateur', getUsers);
router.post('/utilisateur', CreateUser);
router.put('/utilisateur/:id', UpdateUser);
router.delete('/utilisateur/:id', DeleteUser);

module.exports = router;