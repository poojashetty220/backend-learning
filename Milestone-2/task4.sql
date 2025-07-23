\echo 'Get the average age of users'
SELECT ROUND(AVG(age), 2) AS average_age FROM users;
\echo '=================================================='

\echo 'Get the total number of users'
SELECT COUNT(*)  AS total_users FROM users;
\echo '=================================================='

\echo 'Get the user with the maximum age'
SELECT * FROM users ORDER BY age DESC LIMIT 1;
\echo '=================================================='