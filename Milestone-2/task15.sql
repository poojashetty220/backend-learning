\echo 'Query to retrieve all users along with their associated posts (not in JSON)'
SELECT
  u.id   AS user_id,
  u.name,
  u.email,
  p.id   AS post_id,
  p.title,
  p.content
FROM users u
LEFT JOIN posts p ON p.user_id = u.id;
\echo '=================================================='