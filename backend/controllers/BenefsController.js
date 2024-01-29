const db =  require("../model/db");

 const createBenefs = (req, res) => {
    const { Grp_code, Ben_Nom, Ben_Addresse, Ben_code } = req.body;
    const sql = "INSERT INTO béneficiaire (Grp_code, Ben_Nom, Ben_Addresse, Ben_code) VALUES (?,?,?,?)";
  
    db.query(sql, [Grp_code, Ben_Nom, Ben_Addresse, Ben_code], (err, result) => {
      if (err) {
        console.error("Error adding beneficiaire :", err);
        return res.status(500).json({ error: "Internal Server Error", details: err });
      }
  
      return res.status(201).json({ message: "Beneficiaire added successfully", beneficiaireId: result.insertId });
    });
  }

 const getBenefs = (req, res) => {
    const benefsql = "SELECT * FROM béneficiaire"
    db.query(benefsql,(err, data) => {
      if(err) return res.status(500).json({error:"internal Server Error"});
      return res.json(data)
    })
  }

 const updateBenefs = (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
    
      const file = req.files.file;
      const fileName = file.name;
    
      
      file.mv(`./uploads/${fileName}`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
    
        const csvData = fs.readFileSync(`./uploads/${fileName}`, 'utf8');
        const parsedData = csv.parse(csvData, { columns: true });
    
        parsedData.forEach((row) => {
          const sql = "INSERT INTO béneficiaire (Grp_code, Ben_Nom, Ben_Adresse, Ben_code) VALUES (?, ?, ?, ?, ?)";
          db.query(sql, [row.Ben_id, row.Grp_code, row.Ben_Nom, row.Ben_Adresse, row.Ben_code], (err, result) => {
             if (err) {
              console.error("Error inserting data:", err);
              return res.status(500).json({ error: "Internal Server Error", details: err });
            }
          });
        });
    
        res.send("File uploaded and data inserted into 'beneficiaire' table.");
        });
      } catch (error) {
        console.error("Error handling file upload:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error });
      }
    }

 const deleteBenefs = (req, res) => {
    const benefsId = req.params.id;


    const sql = "DELETE FROM groupement WHERE Grp_id = ?";
    
    db.query(sql, [benefsId], (err, result) => {
      if (err) {
        console.error("Error deleting benefs:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows === 0) {
   
        return res.status(404).json({ error: "Benefs not found" });
      }
  
      res.json({ message: "Beneficiaire deleted successfully" });
    });
}

module.exports = { createBenefs, getBenefs, deleteBenefs, updateBenefs }