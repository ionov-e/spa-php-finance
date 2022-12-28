CREATE TABLE users
(
    id              INT(10) PRIMARY KEY AUTO_INCREMENT,
    login           VARCHAR(30),
    password_hashed VARCHAR(255)
);

INSERT INTO users (login, password_hashed)
VALUES ('test', '$2y$10$vZk144sPicCwukNMQNiuRuQY7vROOzUnJzA78yh09vZvw/5wQCtLK');


CREATE TABLE operations
(
    id        INT(10) PRIMARY KEY AUTO_INCREMENT,
    is_income BOOL,
    amount    FLOAT(10, 2),
    comment   TEXT
);

INSERT INTO operations (is_income, amount, comment)
VALUES (true, 400.20, 'Test 1 Plus'),
       (true, 200, 'Test 2 Plus'),
       (false, 100, 'Test 3 Minus'),
       (false, 200, 'Test 4 Minus');