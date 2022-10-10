const express = require("express");
const app = express();
app.use(express.json());
const { getCategories } = require("./controller");

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

module.exports = app;
