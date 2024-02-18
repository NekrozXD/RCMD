const express = require('express');
const router = express.Router();
const WebSocketController = require('../controllers/WebSocket');

router.get('/histenvoi', (req, res) => {
  WebSocketController.sendHistEnvoiDataToClient();
  res.send('Sending histenvoi data to clients');
});

module.exports = router;
