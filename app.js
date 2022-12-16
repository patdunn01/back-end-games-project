const express = require("express");
const app = express();

app.use(express.json());

const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsById,
  addCommentByReviewId
} = require("./controllers/games");
const { handle404Errors } = require("./controllers/games.errors");

//Get Requests

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getCommentsById);

//Post Requests

app.post("/api/reviews/:review_id/comments", addCommentByReviewId)

app.use((err, req, res, next) => {
  if (err.code === '23503') {
    res.status(404).send({ msg: 'Bad request. Try again...' });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '23502') {
    res.status(400).send({ msg: 'Please input all fields' });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid review ID' });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.all("*", handle404Errors);

module.exports = { app };

//res.status(500).send({ msg: 'Internal Server Error' });