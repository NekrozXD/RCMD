const db =  require("../model/db");

 const getFonctions = (req, res) => {
    const functionsql = "SELECT * FROM fonction"
    db.query(functionsql,(err, data) => {
      if (err) return res.status(500).json({error :"internal Server Error"});
      return res.json(data)
    })
  }

  module.exports = { getFonctions }