\echo ' retrieve users whose names start with the letter "J"'
SELECT * FROM users WHERE name LIKE 'J%';
\echo '=================================================='

\echo ' retrieve users whose age is greater than 40 and email ends with @gmail.com'
SELECT * FROM users
 WHERE age > 40 AND email LIKE '%@gmail.com';
\echo '=================================================='