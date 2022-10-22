DROP DATABASE IF EXISTS magic_snippets;
CREATE DATABASE IF NOT EXISTS magic_snippets;
USE magic_snippets;

CREATE TABLE IF NOT EXISTS user
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_name         VARCHAR(20) UNIQUE  NOT NULL,
    given_name        VARCHAR(20)         NOT NULL,
    family_name       VARCHAR(20)         NOT NULL,
    email             VARCHAR(320) UNIQUE NOT NULL,
    profile_picture   MEDIUMTEXT,
    social_media_info JSON                NOT NULL DEFAULT ('[]'),
    phone_number      VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS billing_info
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    card_info  VARCHAR(12) NOT NULL,
    expiration DATE        NOT NULL,
    cvc        VARCHAR(3)  NOT NULL
);

CREATE TABLE IF NOT EXISTS user_config
(
    belongs_to                 INT PRIMARY KEY,
    is_thumbnail_iframe        BOOLEAN DEFAULT TRUE,
    is_premium                 BOOLEAN DEFAULT FALSE,
    snippet_private_by_default BOOLEAN DEFAULT FALSE,
    billing_info_id            INT,
    FOREIGN KEY (belongs_to) REFERENCES user (id),
    FOREIGN KEY (billing_info_id) REFERENCES billing_info (id)
);

CREATE TABLE IF NOT EXISTS snippet
(
    id                    INT PRIMARY KEY AUTO_INCREMENT,
    created_by            INT,
    created_at            DATETIME     NOT NULL DEFAULT (CURDATE()),
    title                 VARCHAR(200) NOT NULL DEFAULT ('An untitled magic snippet'),
    html_content          LONGTEXT              DEFAULT (''),
    css_content           LONGTEXT              DEFAULT (''),
    js_content            LONGTEXT              DEFAULT (''),
    markdown_blog_content LONGTEXT              DEFAULT (''),
    remix_count           INT                   DEFAULT 0,
    html_preprocessor     VARCHAR(20)           DEFAULT 'none',
    css_preprocessor      VARCHAR(20)           DEFAULT 'none',
    js_preprocessor       VARCHAR(20)           DEFAULT 'none',
    # Additional preloaded CSS stylesheets.
    additional_css        JSON                  DEFAULT ('[]'),
    # Additional preloaded JS scripts.
    additional_js         JSON                  DEFAULT ('[]'),
    FOREIGN KEY (created_by) REFERENCES user (id)
);

CREATE TABLE IF NOT EXISTS follow
(
    followed_by   INT NOT NULL,
    follow_target INT NOT NULL,
    FOREIGN KEY (followed_by) REFERENCES user (id),
    FOREIGN KEY (follow_target) REFERENCES user (id)
);

CREATE TABLE IF NOT EXISTS `like`
(
    liked_by    INT NOT NULL,
    like_target INT NOT NULL,
    FOREIGN KEY (liked_by) REFERENCES user (id),
    FOREIGN KEY (like_target) REFERENCES snippet (id)
);

CREATE TABLE IF NOT EXISTS comment
(
    commented_by   INT NOT NULL,
    comment_target INT NOT NULL,
    comment_text LONGTEXT DEFAULT (''),
    FOREIGN KEY (commented_by) REFERENCES user (id),
    FOREIGN KEY (comment_target) REFERENCES snippet (id)
);