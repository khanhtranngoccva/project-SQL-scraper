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
CREATE PROCEDURE get_newest(max INT)
BEGIN
    SELECT snippet.created_at
    FROM snippet
    INNER JOIN `like` ON snippet.id = `like`.like_target
    INNER JOIN comment ON snippet.id = comment.comment_target
    GROUP BY snippet.id
    ORDER BY snippet.created_at DESC
    LIMIT max;
END;
$