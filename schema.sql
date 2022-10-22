CREATE DATABASE magic_snippets;
USE magic_snippets;

CREATE TABLE IF NOT EXISTS user
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_name  VARCHAR(20) UNIQUE NOT NULL,
    given_name VARCHAR(20) NOT NULL,
    family_name VARCHAR(20) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    profile_picture MEDIUMTEXT,
    phone_number VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS user_config
(
    is_thumbnail_iframe BOOLEAN,
    is_premium BOOLEAN,
    snippet_private_by_default BOOLEAN,
    belongs_to INT PRIMARY KEY,
    FOREIGN KEY (belongs_to) REFERENCES user(id)
)