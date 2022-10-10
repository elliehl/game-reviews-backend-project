const { fetchCategories, fetchReviewById } = require("./model");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => next(err));
};

const getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id).then((review) => res.status(200).send({ review }));
};

module.exports = { getCategories, getReviewById };
