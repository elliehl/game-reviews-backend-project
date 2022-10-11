const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "ID not found" });
      }
      return rows[0];
    });
};

module.exports = { fetchReviewById };
