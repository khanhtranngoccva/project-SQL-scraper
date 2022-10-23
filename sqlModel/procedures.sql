USE magic_snippets;

DELIMITER $
DROP PROCEDURE IF EXISTS check_like;
CREATE PROCEDURE check_like(user_id INT, snippet_id INT)
BEGIN
    DECLARE result INT;
    SET result = (SELECT COUNT(*)
                   FROM magic_snippets.`like`
                   WHERE liked_by = user_id
                   AND like_target = snippet_id);
    SELECT IF(result < 0, TRUE, FALSE) AS liked;
END;
$

DELIMITER $
DROP PROCEDURE IF EXISTS add_like;
CREATE PROCEDURE add_like(user_id INT, snippet_id INT)
BEGIN
    DECLARE result INT;
    SET result = (SELECT COUNT(*)
                  FROM magic_snippets.`like`
                  WHERE liked_by = user_id
                    AND like_target = snippet_id);
    CASE
        WHEN result <= 0 THEN INSERT INTO `like` (liked_by, like_target) VALUES (user_id, snippet_id);
        ELSE SELECT NULL;
    END CASE;
END; $

DELIMITER $
DROP PROCEDURE IF EXISTS remove_like;
CREATE PROCEDURE remove_like(user_id INT, snippet_id INT)
BEGIN
    DELETE FROM `like` WHERE liked_by = user_id AND like_target = snippet_id;
END; $

DELIMITER $
DROP PROCEDURE IF EXISTS get_newest;
CREATE PROCEDURE get_newest(max INT, offset INT)
BEGIN
    SELECT *
    FROM snippet_main_view
    ORDER BY created_at
    DESC
    LIMIT max OFFSET offset;
END;
$

DELIMITER $
DROP PROCEDURE IF EXISTS get_most_popular;
CREATE PROCEDURE get_most_popular(max INT, offset INT)
BEGIN
    SELECT *
    FROM snippet_main_view
    ORDER BY like_count
            DESC
    LIMIT max OFFSET offset;
END;
$

DELIMITER $
DROP PROCEDURE IF EXISTS get_comments;
CREATE PROCEDURE get_comments(snippet_id INT)
BEGIN
    SELECT *
    FROM snippet_comment_view
    WHERE snippet_comment_view.snippet_id = snippet_id;
END;
$