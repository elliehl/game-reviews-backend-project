const { fetchReviewById, patchReview } = require("./model");

const getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};

const updateReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  patchReview(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

module.exports = { getReviewById, updateReview };
