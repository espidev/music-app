CREATE TABLE account (
    uuid VARCHAR,
    username VARCHAR(255),
    name VARCHAR(255),
    password_bcrypt VARCHAR(255),
);

CREATE TABLE track (
    accountUuid VARCHAR,
    id INT,
    name TEXT,
    artistUuid VARCHAR,
);