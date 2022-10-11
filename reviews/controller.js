const { fetchReviewById } = require("./model");

const getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};

module.exports = { getReviewById };
