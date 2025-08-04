\echo 'Add a foreign key constraint to the "posts" table that references the "users" table, ensuring referential integrity'
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_user
  FOREIGN KEY (user_id) REFERENCES users(id);
\echo '=================================================='

\echo 'Attempt to insert a post with a non-existent user_id'
INSERT INTO posts (title,content,user_id)
VALUES ('Bad insert','Should fail',999);

SELECT * FROM posts
\echo 'This insert should fail due to foreign key constraint violation'
\echo '=================================================='
