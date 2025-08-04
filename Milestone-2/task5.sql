\echo 'Drop orders table if it exists'
DROP TABLE IF EXISTS orders;
\echo '=================================================='

\echo 'Create orders table'
CREATE TABLE orders (
  order_id   SERIAL PRIMARY KEY,
  user_id    INT NOT NULL,
  order_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
\echo '==================================================='

\echo 'Insert sample data into orders table'
INSERT INTO orders (user_id,order_date) VALUES
(1,'2025-07-15'),
(2,'2025-07-16'),
(3,'2025-07-17'),
(1,'2025-07-18'),
(4,'2025-07-19');
\echo '==================================================='

\echo 'Retrieving all orders with user details'
SELECT o.order_id,
       o.order_date,
       u.name,
       u.email
FROM orders o
JOIN users  u ON u.id = o.user_id;
\echo '==================================================='