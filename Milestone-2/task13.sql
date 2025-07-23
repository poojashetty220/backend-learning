\echo 'Update user information'
UPDATE users SET name = 'Robert Smith' WHERE id = 2;
\echo '=================================================='

\echo 'Delete user with id 3'
DELETE FROM posts WHERE user_id = 3;

SELECT p.*, u.name, u.email
FROM posts p
JOIN users u ON u.id = p.user_id;
\echo '=================================================='
