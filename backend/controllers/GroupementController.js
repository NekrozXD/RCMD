const db =  require("../model/db");

const createGroup = (req, res) => {
  const { Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type, Grp_mail } = req.body;

  if (!Grp_nom || !Grp_code || !Grp_adresse || !Grp_responsable || !Grp_contact || !Grp_type) {
      return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = "INSERT INTO groupement (Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type, Grp_mail) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type, Grp_mail];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error("Error adding group:", err);
          return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(201).json({ message: "Group added successfully", groupId: result.insertId });
  });
};



 const getGroups = (req, res) => {
  const sql = "SELECT * FROM groupement";
  db.query(sql, (err, data) => {  
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json(data);
  });
}

 const getGroup = (req, res) => {
  const grpCode = req.params.grpCode;
  const sql = "SELECT * FROM groupement WHERE Grp_code = ?";
  db.query(sql, [grpCode], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json(data);
  });
}

 const updateGroup = (req, res) => {
  const groupId = req.params.id;
  const { Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type, Grp_mail } = req.body;

  if (!Grp_nom || !Grp_code || !Grp_adresse || !Grp_responsable || !Grp_contact || !Grp_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE groupement
    SET Grp_nom = ?, Grp_code = ?, Grp_adresse = ?, Grp_responsable = ?, Grp_contact = ?, Grp_type = ?, Grp_mail = ?
    WHERE Grp_id = ?`;

  db.query(sql, [Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type,Grp_mail, groupId], (err, result) => {
    if (err) {
      console.error("Error updating group:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
     
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: "Group updated successfully" });
  });
}

 const deleteGroup = (req, res) => {
  const groupId = req.params.id;


  const sql = "DELETE FROM groupement WHERE Grp_id = ?";
  
  db.query(sql, [groupId], (err, result) => {
    if (err) {
      console.error("Error deleting group:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
 
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: "Group deleted successfully" });
  });
}

module.exports = { createGroup, getGroup ,getGroups, deleteGroup , updateGroup }