\echo 'Add a CHECK constraint to ensure age is non-negative'
ALTER TABLE users
ADD CONSTRAINT age_non_negative CHECK (age >= 0);
\echo '=================================================='

\echo 'Insert a user with a negative age to test the constraint'
INSERT INTO users (name, email, age) VALUES
  ('Negative Test', 'neg@example.com', -5);

\echo 'This insert will fail due to CHECK constraint violation'
\echo '=================================================='

SELECT * FROM users;
\echo '=================================================='