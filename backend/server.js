const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

const webSocketRoutes = require('./routes/webSocketRoutes.js');
const users_routes = require('./routes/users.js');
const agence_routes = require('./routes/agence.js');
const benefs_routes = require('./routes/benefs.js');
const fonction_routes = require('./routes/fonction.js');
const group_routes = require('./routes/group.js');
const envoi_routes = require('./routes/envoi.js');
const historique_routes = require('./routes/Historique.js');

const app = express();
const port = 8081;

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

app.use('/', webSocketRoutes);

const interfaces = os.networkInterfaces();
let ip;

Object.keys(interfaces).some((interfaceName) => {
  const addresses = interfaces[interfaceName];
  for (const address of addresses) {
    if (!address.internal && address.family === 'IPv4') {
      ip = address.address;
      return true;
    }
    else{
      ip = 'localhost';
    }
  }
  return false;
});

if (!ip) {
  console.error('Unable to determine IP address');
  process.exit(1);
}

app.listen(port, ip, () => {
  console.log(`Server running at http://${ip}:${port}/`);
});
