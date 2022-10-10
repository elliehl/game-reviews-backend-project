const db = require("./db/connection");

const fetchCategories = () => {
  return db.query("SELECT * FROM categories").then(({ rows }) => rows);
};

const fetchReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((result) => result.rows[0]);
};

module.exports = { fetchCategories, fetchReviewById };
