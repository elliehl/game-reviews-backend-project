const express = require("express");
const app = express();
app.use(express.json());
const { getCategories, getReviewById } = require("./controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.code === 400) {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

module.exports = app;
