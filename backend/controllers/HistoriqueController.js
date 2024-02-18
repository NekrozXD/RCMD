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
        LEFT JOIN historique h ON e.Env_num = h.Env_num;
    `;
    
    db.query(sql, (err, data) => {
        if (err) {  
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        return res.json(data);
    });
};


  
    
  module.exports= { getHistorique, createHistorique ,getHistEnvoi}