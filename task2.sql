\echo 'Retrieving all the users from users table'
SELECT * FROM users;
\echo '=================================================='

\echo 'Retrieving users with age greater than or equal to 30'
SELECT * FROM users WHERE age >= 30;
\echo '=================================================='

\echo 'Retrieving users with email domain example.com'
SELECT * FROM users WHERE email LIKE '%@example.com';
\echo '=================================================='

\echo 'Retrieving users ordered by name in ascending order'
SELECT name FROM users ORDER BY name ASC;
\echo '=================================================='