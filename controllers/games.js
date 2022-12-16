const {
  allCategories,
  allReviews,
  getReviewByRequest,
  getCommentsByReviewId,
  createsNewComment,
} = require("../models/games");

exports.getCategories = (request, response) => {
  allCategories(response).then((category) => {
    response.status(200).send({ category });
  });
};

exports.getReviews = (request, response) => {
  allReviews(response).then((review) => {
    response.status(200).send({ review });
  });
};

exports.getReviewsById = (request, response) => {
  const { review_id } = request.params;
  getReviewByRequest(review_id).then((review) => {
    response.status(200).send({ review });
  });
};

exports.getCommentsById = (request, response) => {
  const review_id = request.params.review_id;
  Promise.all([
    getReviewByRequest(review_id),
    getCommentsByReviewId(review_id),
  ]).then((comments) => {
    if (comments[0]) {
      response.status(200).send({ comments: comments[1] });
    } else {
      response.status(404).send({ msg: "No such path found. Try again..." });
    }
  });
};

exports.addCommentByReviewId = (request, response, next) => {
  createsNewComment(request.body, request.params.review_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
