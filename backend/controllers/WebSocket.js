const WebSocket = require('ws');
const db = require("../model/db.js");

const wss = new WebSocket.Server({ port: 8082 });

const sendHistoriqueData = (ws) => {
  const sql = "SELECT * FROM historique";
  db.query(sql, (err, data) => {  
    if (err) {
      console.error('Error fetching historique data:', err);
      return;
    }

    const jsonData = JSON.stringify(data);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(jsonData, (err) => {
        if (err) {
          console.error('Error sending data to client:', err);
        }
      });
    }
  });
};

const sendHistEnvoiData = (ws) => {
  const sql = `
    SELECT 
    e.Env_num,
    e.Env_poids,
    e.Env_exp,
    e.Env_dest,
    e.Env_taxe,
    e.Env_date_depot,
    e.Env_agence_depot,
    h.HIst_evenement,
    h.Hist_date,
    h.Hist_etat,
    h.Hist_agence
  FROM envoi e
  LEFT JOIN historique h ON e.Env_num = h.Env_num;
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching envoy data:', err);
      return;
    }

    const jsonData = JSON.stringify(data);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(jsonData, (err) => {
        if (err) {
          console.error('Error sending data to client:', err);
        }
      });
    }
  });
};

const sendHistEnvoiDataToClient = (ws) => {
  const sql = `
    SELECT 
    e.Env_num,
    e.Env_poids,
    e.Env_exp,
    e.Env_dest,
    e.Env_taxe,
    e.Env_date_depot,
    e.Env_agence_depot,
    h.HIst_evenement,
    h.Hist_date,
    h.Hist_etat,
    h.Hist_agence
  FROM envoi e
  LEFT JOIN historique h ON e.Env_num = h.Env_num;
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching envoy data:', err);
      return;
    }

    const jsonData = JSON.stringify(data);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(jsonData, (err) => {
        if (err) {
          console.error('Error sending data to client:', err);
        }
      });
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message from client:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  sendHistoriqueData(ws);
  sendHistEnvoiData(ws);
});

setInterval(() => {
  wss.clients.forEach((client) => {
    sendHistoriqueData(client);
    sendHistEnvoiData(client);
  });
}, 200);

module.exports = { wss, sendHistoriqueData, sendHistEnvoiData, sendHistEnvoiDataToClient };
