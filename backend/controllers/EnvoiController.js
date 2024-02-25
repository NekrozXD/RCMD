const db =  require("../model/db");

 const getEnvoi = (req, res) => {
    const envoisql = "SELECT * FROM envoi"
    db.query(envoisql,(err, data) => {
      if (err) return res.status(500).json({error : "internal Server Error"});
      return res.json(data)
    })
  }

 const createEnvoi = (req, res) => {
    const { Env_num, Env_poids,Env_taxe, Env_exp, Env_dest, Env_date_depot, Env_agence_depot } = req.body;

    console.log('Received Env_date_depot:', Env_date_depot);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

    const sql = "INSERT INTO envoi (Env_num, Env_poids,Env_taxe, Env_exp, Env_dest, Env_date_depot, Env_agence_depot) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Env_num, Env_poids,Env_taxe, Env_exp, Env_dest, formattedDate.slice(0, 10), Env_agence_depot], (err, result) => {
        if (err) {
            console.error("Error adding envoi:", err);

            return res.status(500).json({ error: "Internal Server Error", details: err });
        }

        return res.status(201).json({ message: "Envoi added successfully", envoiId: result.insertId });
    });
}

 const createEnvoiUpload =  (req, res) => {
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
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
  
          const sql = "INSERT INTO envoi (Env_num, Env_poids, Env_taxe, Env_exp, Env_dest, Env_date_depot, Env_agence_depot) VALUES (?, ?, ?, ?, ?, ?, ?)";
          db.query(sql, [row.Env_num, row.Env_poids, row.Env_taxe, row.Env_exp, row.Env_dest, formattedDate.slice(0, 10), row.Env_agence_depot], (err, result) => {
            if (err) {
              console.error("Error inserting data:", err);
              return res.status(500).json({ error: "Internal Server Error", details: err });
            }
          });
        }
        );

      res.send("File uploaded and data inserted into 'envoi' table.");
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}

 const getCombinedData = (req, res) => {
    const sql = `
        SELECT 
          b.Ben_id,
          b.Grp_code,
          b.Ben_Nom,
          b.Ben_Addresse,
          b.Ben_code,
          COALESCE(a.agence_nom, g.grp_nom) AS Agence_nom,
          g.Grp_id,
          g.Grp_nom,
          g.Grp_code,
          g.Grp_adresse,
          g.Grp_responsable,
          g.Grp_contact,
          g.Grp_type,
          g.Grp_mail
        FROM béneficiaire b
        LEFT JOIN agence a ON b.grp_code = a.agence_code
        LEFT JOIN groupement g ON b.grp_code = g.grp_code;
      `;
    
    db.query(sql, (err, data) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log('Query results:', data);
        return res.json(data);
      });
}


const getLast5Envoi = (req, res) => {
  const envoisql = "SELECT * FROM envoi ORDER BY Env_id DESC LIMIT 10";
  
  db.query(envoisql, (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json(data);
  });
};  

module.exports = { createEnvoi, getCombinedData, getEnvoi, createEnvoiUpload, getLast5Envoi };