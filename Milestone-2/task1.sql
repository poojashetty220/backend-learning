\echo 'Dropping table users if it exists'
DROP TABLE IF EXISTS users;
\echo '=================================================='

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    age INTEGER
);

\echo 'Users table created successfully'

\echo '=================================================='

INSERT INTO users (name, email, age) VALUES
  ('Alice Johnson',  'alice@gmail.com',  46),
  ('Bob Kapoor',     'bob.kapoor@example.com', 35),
  ('Carla Mendes',   'carla.m@example.com', 27),
  ('Jane Nguyen',   'jane.nguyen@example.net', 41),
  ('Ella García',    'ella.garcia@example.io', 33);

\echo '5 users inserted into users table'

\echo '=================================================='

