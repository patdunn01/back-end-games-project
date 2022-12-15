const express = require("express");
const app = express();

app.use(express.json());

const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsById,
} = require("./controllers/games");
const { handle404Errors } = require("./controllers/games.errors");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getCommentsById);

app.all("*", handle404Errors);

module.exports = { app };
