const express = require("express");
const app = express();
app.use(express.json());
const { getCategories } = require("./categories/controller");
const { getEndpoints } = require("./controller");
const {
  getReviewById,
  updateReview,
  getReviews,
  getCommentsByReviewId,
  addComment,
  removeComment,
} = require("./reviews/controller");
const { getUsers } = require("./users/controller");
const cors = require("cors");

app.use(cors());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", updateReview);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", addComment);
app.delete("/api/comments/:comment_id", removeComment);
app.get("/api", getEndpoints);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Missing required field" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Invalid username" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
