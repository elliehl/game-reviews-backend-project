const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "ID not found" });
      }
      return rows[0];
    });
};

const patchReview = (incomingVotes = 0, review_id) => {
  // incomingVotes is req.body.inc_votes (20 in this case)
  // needs to have a default value to pass the if block on line 18
  // needed to do a test here to make sure that the inc_votes is a number, so it wouldn't send unnecessary (and maybe expensive) requests
  if (typeof incomingVotes !== "number") {
    return Promise.reject({
      status: 400,
      message: "This input should be a number",
    });
  }
  return db
    .query(
      "UPDATE reviews SET votes = $1 + votes WHERE review_id = $2 RETURNING *;",
      [incomingVotes, review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "ID not found" });
      }
      return rows[0];
    });
};

module.exports = { fetchReviewById, patchReview };
