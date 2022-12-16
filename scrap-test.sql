\c nc_games_test

SELECT * FROM categories;
SELECT * FROM comments;
SELECT * FROM reviews;

-- Reviews with reviews count SQL --

-- SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
-- FROM reviews 
-- LEFT JOIN comments ON comments.review_id = reviews.review_id
-- GROUP BY reviews.review_id, comments.review_id
-- ORDER BY reviews.created_at DESC;

-- SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
-- FROM reviews 
-- WHERE reviews.review_id = $1;

--SELECT * FROM reviews WHERE review_id = $1;

SELECT * FROM comments WHERE review_id = 1;