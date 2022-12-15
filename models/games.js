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

// exports.getCommentsByReviewId = async (review_id) => {
//   console.log("reached models")
//   const dbOutput = db.query("SELECT * FROM comments WHERE review_id = $1;", [
//     review_id,
//   ]);
//   if (dbOutput.rows.length === 0) {
//     return Promise.reject({
//       status: 404,
//       msg: "No such path found. Try again...",
//     });
//   }
// };

exports.getCommentsByReviewId = (review_id) => {
  return db
    .query("SELECT * FROM comments WHERE review_id = $1;", [review_id])
    .then((result) => {
      return result.rows;
    });
};