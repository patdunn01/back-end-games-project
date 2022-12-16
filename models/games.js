const db = require("../db/connection");

exports.allCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => result.rows);
};

exports.allReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id, comments.review_id
    ORDER BY reviews.created_at DESC;`
    )
    .then((result) => result.rows);
};

exports.getReviewByRequest = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((result) => result.rows[0]);
};

exports.getCommentsByReviewId = (review_id) => {
  return db
    .query("SELECT * FROM comments WHERE review_id = $1;", [review_id])
    .then((result) => {
      return result.rows;
    });
};

exports.createsNewComment = (newComment, reviewID) => {
  const { body, user_name } = newComment;
  return db
    .query(
      `INSERT INTO comments (body, review_id, author)
      VALUES 
        ($1, $2, $3)
      RETURNING *;
    `,
      [body, reviewID, user_name]
    )
    .then((result) => {
      console.log(result, "result")
      return result.rows[0];
    });
};