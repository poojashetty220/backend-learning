\echo 'Retrieve all posts along with the corresponding user information'
SELECT p.*, u.name, u.email
FROM posts p
JOIN users u ON u.id = p.user_id;
\echo '=================================================='

\echo 'Retrieve all posts for a specific user'
SELECT * FROM posts WHERE user_id = 1;
\echo '=================================================='

\echo 'Retrieve the user(s) who have the most posts'
SELECT u.id,u.name,u.email,COUNT(p.id) post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id
ORDER BY post_count DESC
LIMIT 1;
\echo '=================================================='
