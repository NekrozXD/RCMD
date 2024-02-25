const db =  require("../model/db.js");
const util = require('util');

const getHistorique = (req, res) => {
    const sql = "SELECT * FROM historique";
    db.query(sql, (err, data) => {  
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      return res.json(data);
    });
  }
  const createHistorique = (req, res) => {
    const { Env_num, HIst_evenement, Hist_date, Hist_etat, Hist_agence} = req.body;
    const sql = "INSERT INTO historique (Env_num, HIst_evenement, Hist_date, Hist_etat, Hist_agence) VALUES (?,?,?,?,?)";
  
    db.query(sql, [Env_num, HIst_evenement, Hist_date, Hist_etat, Hist_agence], (err, result) => {
      if (err) {
        console.error("Error sending historique:", err);
        return res.status(500).json({ error: "Internal Server Error", details: err });
      }
  
      return res.status(201).json({ message: "depot historique created", HisoriqueId: result.insertId });
    });
  }

  const getHistEnvoi = (req, res) => {
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
      LEFT JOIN historique h ON e.Env_num = h.Env_num
      ORDER BY h.Hist_id DESC;
  `;

    
    db.query(sql, (err, data) => {
        if (err) {  
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        return res.json(data);
    });
};

const updateHistorique = (req, res) => {
  const { Env_num, HIst_evenement, Hist_date, Hist_etat, Hist_agence } = req.body;
  const sql = `
      UPDATE historique 
      SET 
          HIst_evenement = ?,
          Hist_date = ?,
          Hist_etat = ?,
          Hist_agence = ?
      WHERE
          Env_num = ?
  `;
  
  db.query(sql, [HIst_evenement, Hist_date, Hist_etat, Hist_agence, Env_num], (err, result) => {
      if (err) {
          console.error("Error updating historique:", err);
          return res.status(500).json({ error: "Internal Server Error", details: err });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Historique not found" });
      }

      return res.status(200).json({ message: "Historique updated successfully" });
  });
};

module.exports = { getHistorique, createHistorique, getHistEnvoi, updateHistorique };
