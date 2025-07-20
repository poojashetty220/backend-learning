\echo 'Query to retrieve all users and their posts in a JSON format'
SELECT
  u.id   AS user_id,
  u.name,
  u.email,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'post_id', p.id,
        'title',   p.title,
        'content', p.content
      )
    ) FILTER (WHERE p.id IS NOT NULL),
    '[]'::jsonb
  ) AS posts
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id;
\echo '=================================================='
