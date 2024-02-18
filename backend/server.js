const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const webSocketRoutes = require('./routes/webSocketRoutes.js');
const users_routes = require('./routes/users.js');
const agence_routes = require('./routes/agence.js');
const benefs_routes = require('./routes/benefs.js');
const fonction_routes = require('./routes/fonction.js');
const group_routes = require('./routes/group.js');
const envoi_routes = require('./routes/envoi.js');
const historique_routes = require('./routes/Historique.js');

const host = "localhost";
const port = 8081;

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

app.use('/', users_routes);
app.use('/', agence_routes);
app.use('/', benefs_routes);
app.use('/', fonction_routes);
app.use('/', group_routes);
app.use('/', envoi_routes);
app.use('/', historique_routes);

// Use WebSocket route
app.use('/', webSocketRoutes);

app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});
