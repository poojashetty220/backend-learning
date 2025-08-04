\echo 'Inserting sample data into users table'
INSERT INTO users (id, name,email) VALUES
(1, 'Alice Johnson','alice@example.com'),
(2, 'Bob Smith','bob@gmail.com'),
(3, 'Charlie Green','charlie@example.com');
\echo '=================================================='

\echo 'Inserting sample data into posts table'
INSERT INTO posts (id, title,content,user_id) VALUES
('p1', 'Post 1','Content 1',1),
('p2', 'Post 2','Content 2',2),
('p3', 'Post 3','Content 3',3),
('p4', 'Post 4','Another by Alice',1),
('p5', 'Post 5','Bob second post',2);
\echo '=================================================='