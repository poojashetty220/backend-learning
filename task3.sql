\echo 'Update user with id 2 to age 50'
UPDATE users SET age = 50 WHERE id = 2;
SELECT * FROM users WHERE id = 2;
\echo '=================================================='

\echo 'Delete user with id 5'
DELETE FROM users WHERE id = 5;
SELECT * FROM users;
\echo '=================================================='

\echo 'Insert a new user into users table'
INSERT INTO users (name,email,age)
VALUES ('Ethan Brooks','ethan.brooks@example.com',29);
SELECT * FROM users
\echo 'New user inserted successfully'
