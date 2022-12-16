\c nc_games_test

-- SELECT * FROM categories;
-- SELECT * FROM comments;
-- SELECT * FROM reviews;
-- SELECT * FROM users;


INSERT INTO comments (body, review_id, author)
VALUES 
    ('What a game!', 2, 'mallionaire')
RETURNING *;

SELECT * FROM comments;