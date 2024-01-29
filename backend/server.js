const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');

const users_routes = require('./routes/users.js')
const agence_routes = require('./routes/agence.js')
const benefs_routes = require('./routes/benefs.js')
const fonction_routes = require('./routes/fonction.js')
const group_routes = require('./routes/group.js')
const envoi_routes = require('./routes/envoi.js')

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

app.listen(port, () => {
  console.log(`serve run on http://${host}:${port}`);
});
