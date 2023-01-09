const express = require("express");
const app = express();

const cors = require('cors');

app.use(cors());


app.use(express.json());

const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsById,
  addCommentByReviewId,
  increaseVotesById
} = require("./controllers/games");
const { handle404Errors } = require("./controllers/games.errors");
const { entries } = require("./db/data/test-data/comments");

//Get Requests

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getCommentsById);

//Post Requests

app.post("/api/reviews/:review_id/comments", addCommentByReviewId)

//Patch Requests

app.patch("/api/reviews/:review_id/", increaseVotesById)

//Error Handlers

app.use((err, req, res, next) => {
  if (err.code === '23503') {
    res.status(404).send({ msg: "Nothing found for this. Try again..." });
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
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.all("*", handle404Errors);

module.exports = { app };
