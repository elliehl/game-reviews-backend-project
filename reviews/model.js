const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
       FROM reviews 
       LEFT JOIN comments
       ON comments.review_id = reviews.review_id
       WHERE reviews.review_id = $1 
       GROUP BY reviews.review_id;`,
      [review_id]
    )
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

const fetchReviews = (sort_by = "created_at", order = "desc", category) => {
  let queryString = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) ::INT AS comment_count
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  const queryValues = [];

  if (category !== undefined) {
    queryString += ` WHERE reviews.category = $1`;
    queryValues.push(category);
  }

  queryString += ` 
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return db
        .query(`SELECT * FROM categories WHERE slug = $1`, [category])
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              message: "This category does not exist",
            });
          }
        });
    }
    return rows;
  });
};

module.exports = { fetchReviewById, patchReview, fetchReviews };
