\echo 'Add a foreign key constraint to the "posts" table that references the "users" table, ensuring referential integrity'
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_user
  FOREIGN KEY (user_id) REFERENCES users(id);
\echo '=================================================='

\echo 'Attempt to insert a post with a non-existent user_id'
SELECT * FROM users WHERE id = 2;
INSERT INTO posts (id, title,content,user_id)
VALUES ('p6', 'good insert','Should not fail', 999);

SELECT * FROM posts
\echo 'This insert should fail due to foreign key constraint violation'
\echo '=================================================='
