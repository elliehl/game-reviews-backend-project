const express = require("express");
const app = express();
app.use(express.json());
const { getCategories, getReviewById } = require("./controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users");

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

module.exports = app;
