\echo 'Dropping table users and posts if it exists'
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
\echo '=================================================='

\echo 'Creating users and posts tables'
CREATE TABLE users (
  id    INT PRIMARY KEY,
  name  VARCHAR(100)  NOT NULL,
  email VARCHAR(150)  NOT NULL UNIQUE
);

CREATE TABLE posts (
  id      VARCHAR(20) PRIMARY KEY,
  title   VARCHAR(255) NOT NULL,
  content TEXT         NOT NULL,
  user_id INT          NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
\echo '=================================================='
