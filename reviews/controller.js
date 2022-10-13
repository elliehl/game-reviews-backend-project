const {
  fetchReviewById,
  patchReview,
  fetchReviews,
  fetchCommentsByReviewId,
  postComment,
} = require("./model");

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

const getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  fetchReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

const getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then(() => fetchCommentsByReviewId(review_id))
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

const addComment = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then(() => postComment(newComment, review_id))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

module.exports = {
  getReviewById,
  updateReview,
  getReviews,
  getCommentsByReviewId,
  addComment,
};
