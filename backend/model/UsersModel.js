// models/db.js
const { db } = require('./db.js');

/**
 * Add a new user to the database.
 * @param {Object} userData - User data to be inserted into the database.
 * @returns {Promise<number>} - The ID of the newly inserted user.
 */
const addUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_id } = userData;

    if (!Us_nom || !Us_matricule || !Us_login || !Us_mail || !Us_pwd || !Fo_id || !Grp_id) {
      return reject(new Error("Missing required fields"));
    }

    const userSql = "INSERT INTO utilisateur (Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(userSql, [Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_id], (err, result) => {
      if (err) {
        console.error("Error adding user:", err);
        return reject(new Error("Internal Server Error"));
      }

      resolve(result.insertId);
    });
  });
};

module.exports = { addUser };
