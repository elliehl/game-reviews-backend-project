const db = require("./db/connection");

const fetchCategories = () => {
  return db.query("SELECT * FROM categories").then(({ rows }) => rows);
};

module.exports = { fetchCategories };
