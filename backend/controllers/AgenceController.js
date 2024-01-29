const db =  require("../model/db.js");

  const createAgence = (req, res) => {
    const { Agence_nom, Agence_code } = req.body;
    const sql = "INSERT INTO `agence` (Agence_nom, Agence_code) VALUES (?, ?)";
    db.query(sql, [Agence_nom, Agence_code], (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      return res.json({ success: true, message: "Agence added successfully" });
    });
  }

  const getAgences = (req, res) => {
    const sql = "SELECT * FROM `agence`"
    db.query(sql,(err,data) => {
      if (err) return res.status(500).json({ error : "Internal Server Error"});
      return res.json(data)
    })
  }

 const updateAgence = (req, res) => {
    const agenceId = req.params.id;
    const { Agence_nom, Agence_code } = req.body;
    const sql = "UPDATE `agence` SET Agence_nom = ?, Agence_code = ? WHERE Agence_id = ?";
    db.query(sql, [Agence_nom, Agence_code, agenceId], (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      return res.json({ success: true, message: "Agence updated successfully" });
    });
  }

 const deleteAgence = (req, res) => {
    const agenceId = req.params.id;
      console.log("Deleting Agence with ID:", agenceId); 
      const sql = "DELETE FROM `agence` WHERE Agence_id = ?";
    db.query(sql, [agenceId], (err, data) => {
      if (err) {
        console.error("Error deleting agence:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (data.affectedRows === 0) {
  
        return res.status(404).json({ error: "Agence not found" });
      }
  
      return res.json({ success: true, message: "Agence deleted successfully" });
    });
  }
  
  module.exports = { createAgence, getAgences, updateAgence, deleteAgence }