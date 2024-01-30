const db =  require("../model/db.js");

 const getUsers = (req, res) => {
    const sql = 'SELECT * FROM utilisateur';
    db.query(sql, (error, data) => {
        if (error) return res.status(500).json({ error: error })
        return res.json(data);
    });
}

 const CreateUser = (req, res) => {
    const { Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_code } = req.body;

    if (!Us_nom || !Us_matricule || !Us_login || !Us_mail || !Us_pwd || !Fo_id || !Grp_code) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const userSql = "INSERT INTO utilisateur (Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_code) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(userSql, [Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_code], (err, result) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const fetchUserSql = "SELECT * FROM utilisateur WHERE Us_id = ?";
      db.query(fetchUserSql, [result.insertId], (fetchErr, userData) => {
        if (fetchErr) {
          console.error("Error fetching added user:", fetchErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json({ message: "User added successfully", user: userData[0] });
      });
    });
  }

  const UpdateUser = (req, res) => {
    const userId = req.params.id;
    const { Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_code } = req.body;
  
    const sql = "UPDATE utilisateur SET Us_nom = ?, Us_matricule = ?, Us_login = ?, Us_mail = ?, Us_pwd = ?, Fo_id = ?, Grp_code = ? WHERE Us_id = ?";
    db.query(sql, [Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_code, userId], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({ message: "User updated successfully" });
    });
  }
  
  const DeleteUser = (req, res) => {
    const userId = req.params.id;
  
    const deleteSql = "DELETE FROM utilisateur WHERE Us_id = ?";
    db.query(deleteSql, [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({ message: "User deleted successfully" });
    });
  }
  

module.exports = { CreateUser, getUsers, UpdateUser, DeleteUser }